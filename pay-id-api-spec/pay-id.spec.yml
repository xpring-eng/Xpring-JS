openapi: 3.0.0
info:
  title: PayID
  version: '1.0'
servers:
  - url: 'https://'
paths:
  '/{userAndHost}':
    parameters:
      - schema:
          type: string
        name: userAndHost
        in: path
        required: true
    get:
      summary: users
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: string
        '404':
          description: Not Found
      operationId: get-userAndHost
components:
  schemas: {}
  securitySchemes: {}
