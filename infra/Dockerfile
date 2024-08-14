FROM tajawalcom/node:22.6.0-alpine as builder

WORKDIR /app
COPY package*.json .npmrc ./
RUN yarn install
COPY . ./

FROM tajawalcom/node:22.6.0-alpine
WORKDIR /app
# Copy app source
COPY --from=builder /app/ ./
# RUN yarn start
# CMD ["yarn", "start"]
CMD ["npm","run", "start"]
