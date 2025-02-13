import Fastify from "fastify";
import FastifyCors from '@fastify/cors';
import FastifyMultipart from "@fastify/multipart";
import sharp from "sharp";
import ico from "ico";

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 8080;

// Register multipart support
fastify.register(FastifyMultipart);

// Enable CORS
fastify.register(FastifyCors, {
  origin: '*', // Allow all origins. Change this to a specific domain if needed.
  methods: ['POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
});

// Convert PNG to ICO and return as response
fastify.post("/convert", async (request, reply) => {
  const data = await request.file(); // Get the uploaded file

  if (!data || data.mimetype !== "image/png") {
      return reply.status(400).send({ error: "Please upload a PNG file" });
  }

  try {
      // Read the PNG file buffer
      const pngBuffer = await data.toBuffer();

      // Define common favicon sizes
      const sizes = [16, 32, 48, 64, 128, 256];
      const images = [];

      // Generate images for each size in memory
      for (const size of sizes) {
          const buffer = await sharp(pngBuffer)
              .resize(size, size)
              .toBuffer();
          images.push({ width: size, height: size, buffer });
      }

      // Convert images to ICO format (in memory)
      const icoBuffer = ico.encode(images);

      // Send ICO file as response without storing it
      reply
          .header("Content-Type", "image/x-icon")
          .header("Content-Disposition", "attachment; filename=favicon.ico")
          .send(icoBuffer);
  } catch (error) {
      reply.status(500).send({ error: "Failed to process the image" });
  }
});

// Health check
fastify.get('/', async (request, reply) => {
  return { message: 'Server is running!' };
});

// Start the Fastify server
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});
