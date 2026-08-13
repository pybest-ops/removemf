import type { RestoreModelInput } from './restoreSettings';

type ReplicatePredictionInput = {
  input_image: string;
  aspect_ratio?: RestoreModelInput['aspect_ratio'];
  output_format?: RestoreModelInput['output_format'];
  prompt?: string;
  prompt_upsampling?: boolean;
  reference_image?: string;
  safety_tolerance?: number;
};

type ReplicatePredictionRequest = {
  version?: string;
  input: ReplicatePredictionInput;
  webhook?: string;
  webhook_events_filter?: string[];
};

type ReplicatePrediction = {
  id: string;
  status: string;
  output?: string | string[] | null;
  error?: string | null;
};

const replicateApiBaseUrl = 'https://api.replicate.com/v1';
const defaultImageEditModelPath = 'black-forest-labs/flux-kontext-pro';

// createReplicatePrediction 创建 Replicate 图片恢复预测任务。
export async function createReplicatePrediction(inputImageUrl: string, restoreModelInput?: RestoreModelInput, webhookUrl?: string) {
  const apiToken = process.env.REPLICATE_API_TOKEN ?? process.env.REPLICATE_API_TOKEN_PRIVATE;
  const modelPath = process.env.REPLICATE_IMAGE_EDIT_MODEL ?? defaultImageEditModelPath;
  const modelVersion = process.env.REPLICATE_IMAGE_EDIT_VERSION;

  if (!apiToken) throw new Error('REPLICATE_API_TOKEN is required');

  const payload: ReplicatePredictionRequest = {
    input: {
      input_image: inputImageUrl,
      ...restoreModelInput
    }
  };

  if (modelVersion) payload.version = modelVersion;

  if (webhookUrl) {
    payload.webhook = webhookUrl;
    payload.webhook_events_filter = ['completed'];
  }

  const predictionUrl = modelVersion
    ? `${replicateApiBaseUrl}/predictions`
    : `${replicateApiBaseUrl}/models/${modelPath}/predictions`;

  const response = await fetch(predictionUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate prediction failed: ${errorText}`);
  }

  return (await response.json()) as ReplicatePrediction;
}

// getReplicatePrediction 查询 Replicate prediction 的最新状态。
export async function getReplicatePrediction(predictionId: string) {
  const apiToken = process.env.REPLICATE_API_TOKEN ?? process.env.REPLICATE_API_TOKEN_PRIVATE;

  if (!apiToken) throw new Error('REPLICATE_API_TOKEN is required');

  const response = await fetch(`${replicateApiBaseUrl}/predictions/${predictionId}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate prediction lookup failed: ${errorText}`);
  }

  return (await response.json()) as ReplicatePrediction;
}

// getReplicateOutputUrl 从 prediction 输出里取第一张结果图地址。
export function getReplicateOutputUrl(output: ReplicatePrediction['output']) {
  if (!output) return null;
  if (typeof output === 'string') return output;
  return output[0] ?? null;
}
