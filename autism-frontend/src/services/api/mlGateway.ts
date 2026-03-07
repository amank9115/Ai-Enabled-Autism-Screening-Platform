import type { MlInferenceRequest, MlInferenceResponse } from "../../ai/inferenceContracts"

const API_BASE = "/api/v1"

export const mlGateway = {
  runInference: async (payload: MlInferenceRequest): Promise<MlInferenceResponse> => {
    void API_BASE
    return Promise.resolve({
      sessionId: payload.sessionId,
      status: "running",
      explanation: [
        "Placeholder: Connect to Python inference service for behavior scoring.",
        "Placeholder: Attach model confidence and frame-level attributions.",
      ],
    })
  },
}
