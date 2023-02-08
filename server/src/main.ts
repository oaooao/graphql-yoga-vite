import { execute, parse } from "graphql";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { schema } from "./schema";

async function main() {
  const yoga = createYoga({ schema });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
  });
}

main();
