import { Admin, Kafka, Producer, logLevel } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
  private brokers: string;
  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "192.168.1.5:9092";
    this.kafka = new Kafka({
      brokers: [this.brokers],
      clientId: "post-producer",
      logLevel: logLevel.ERROR,
    });

    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.admin.connect();
      await this.producer.connect();
      console.log("Connected to Kafka");
    } catch (error: any) {
      console.log("Failed to connect to Kafka");
      console.log(error?.message);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.admin.disconnect();
      await this.producer.disconnect();
      console.log("Disconnected from Kafka");
    } catch (error: any) {
      console.log("Failed to disconnect from Kafka");
      console.log(error?.message);
    }
  }

  async createTopic(topic: string): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [
          {
            topic,
            numPartitions: 1,
          },
        ],
      });
      console.log("Created topic", topic);
    } catch (error: any) {
      console.error("Failed to create topic", error.message);
    }
  }

  async sentToTopic(topic: string, message: string): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log("Message Sent to topic", topic);
    } catch (error: any) {
      console.error("Failed to sent to topic", error.message);
    }
  }
}

export default new KafkaConfig();
