import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";
import { HelloResolver } from "./resolvers/hello";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm-config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => console.log(err));
