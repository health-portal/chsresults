"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const environment_1 = require("./environment");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Marksheet API')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'accessToken')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    await app.listen(environment_1.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map