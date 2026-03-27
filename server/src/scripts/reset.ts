
import connectDB from "../config/db";
import { resetDatabase } from "../utils/resetDB";

(async () => {
  await connectDB();
  await resetDatabase();

  process.exit(0);
})();