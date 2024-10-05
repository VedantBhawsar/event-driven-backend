import kafkaConfig from "./config/kafka.config";

export const init = async () => {
  try {
    await kafkaConfig.connect();
    await kafkaConfig.createTopic("posts");
  } catch (error: any) {
    console.error("Failed to initialize services", error.message);
    process.exit(1);
  }
};
