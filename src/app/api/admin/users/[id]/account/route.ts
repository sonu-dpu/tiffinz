import { UserRole } from "@/constants/enum";
import { updateUserAccountBalance } from "@/helpers/server/admin.accounts";
import { ApiResponse } from "@/utils/ApiResponse";
import { withAuth } from "@/utils/withAuth";
import {
  UpdateUserAccountBalanceParams,
  UpdateUserAccountBalanceSchema,
} from "@/zod/account.schema";

const addBalanceToUserAccount = withAuth<{ id: string }>(
  async (req, context) => {
    const { id: userId } = await context.params;
    const body = await req.json();
    const { amount, type, accountId } = body;
    const document: UpdateUserAccountBalanceParams = {
      amount,
      type,
      accountId,
      userId,
    };
    const parseResult = UpdateUserAccountBalanceSchema.safeParse(document);
    if (parseResult.success === false) {
      return ApiResponse.zodError(parseResult.error);
    }
    const { transaction } = await updateUserAccountBalance(parseResult.data);
    const message = `Account balance updated successfully`;
    return ApiResponse.success(message, { transaction });
  },
  { requiredRole: UserRole.admin }
);

export { addBalanceToUserAccount as PATCH };
