// Import global routes
import routes from "./routes";
import { initializeModels } from "./models";
// Initialize feature models (Sylph-specific)
import "~/features/products/models/product.model";
import "~/features/inquiries/models/inquiry.model";
import "~/features/collection/models/collection-item.model";

// Initialize models
await initializeModels();

export default routes;
