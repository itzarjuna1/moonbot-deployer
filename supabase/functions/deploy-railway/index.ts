import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RAILWAY_API_URL = 'https://backboard.railway.app/graphql/v2';

interface DeployRequest {
  apiId: string;
  apiHash: string;
  stringSession: string;
  botToken: string;
  ownerId: string;
  mongoUri?: string;
  loggerGroup?: string;
  projectName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const RAILWAY_API_TOKEN = Deno.env.get('RAILWAY_API_TOKEN');
    
    if (!RAILWAY_API_TOKEN) {
      console.error('RAILWAY_API_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Deployment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: DeployRequest = await req.json();

    // Validate required fields
    if (!data.apiId || !data.apiHash || !data.stringSession || !data.botToken || !data.ownerId) {
      return new Response(
        JSON.stringify({ error: 'Missing required credentials' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const projectName = data.projectName || `music-bot-${data.ownerId.slice(-6)}`;

    // Step 1: Create a new Railway project
    const createProjectQuery = `
      mutation CreateProject($name: String!) {
        projectCreate(input: { name: $name }) {
          id
          name
        }
      }
    `;

    const projectResponse = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: createProjectQuery,
        variables: { name: projectName },
      }),
    });

    const projectResult = await projectResponse.json();
    
    if (projectResult.errors) {
      console.error('Railway project creation failed:', projectResult.errors);
      return new Response(
        JSON.stringify({ error: 'Failed to create deployment project' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const projectId = projectResult.data.projectCreate.id;

    // Step 2: Create a service from GitHub repo
    const createServiceQuery = `
      mutation ServiceCreate($projectId: String!, $repo: String!) {
        serviceCreate(input: {
          projectId: $projectId
          source: { repo: $repo }
        }) {
          id
          name
        }
      }
    `;

    // Using the music-bot directory from the repo
    const serviceResponse = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: createServiceQuery,
        variables: {
          projectId,
          repo: 'https://github.com/uppermoon-devs/music-bot', // Your music bot repo
        },
      }),
    });

    const serviceResult = await serviceResponse.json();
    
    if (serviceResult.errors) {
      console.error('Railway service creation failed:', serviceResult.errors);
      return new Response(
        JSON.stringify({ error: 'Failed to create bot service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceId = serviceResult.data.serviceCreate.id;

    // Step 3: Set environment variables
    const envVars: Record<string, string> = {
      API_ID: data.apiId,
      API_HASH: data.apiHash,
      STRING_SESSION: data.stringSession,
      BOT_TOKEN: data.botToken,
      OWNER_ID: data.ownerId,
    };

    if (data.mongoUri) {
      envVars.MONGO_URI = data.mongoUri;
    }
    if (data.loggerGroup) {
      envVars.LOGGER_GROUP = data.loggerGroup;
    }

    const setEnvQuery = `
      mutation VariablesUpsert($projectId: String!, $serviceId: String!, $variables: Json!) {
        variableCollectionUpsert(input: {
          projectId: $projectId
          serviceId: $serviceId
          variables: $variables
        })
      }
    `;

    const envResponse = await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: setEnvQuery,
        variables: {
          projectId,
          serviceId,
          variables: envVars,
        },
      }),
    });

    const envResult = await envResponse.json();
    
    if (envResult.errors) {
      console.error('Railway env vars failed:', envResult.errors);
      // Continue anyway, env vars might need manual setup
    }

    // Step 4: Deploy the service
    const deployQuery = `
      mutation ServiceInstanceDeploy($serviceId: String!) {
        serviceInstanceDeploy(serviceId: $serviceId)
      }
    `;

    await fetch(RAILWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: deployQuery,
        variables: { serviceId },
      }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        projectId,
        serviceId,
        projectName,
        dashboardUrl: `https://railway.app/project/${projectId}`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(
      JSON.stringify({ error: 'Deployment failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
