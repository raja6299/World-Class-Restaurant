import { BranchRepository } from './repository';
import { BranchFormData, BranchSchema } from './validation';


export class BranchService {
  static async getBranches(restaurantId: string) {
    return BranchRepository.getBranchesByRestaurant(restaurantId);
  }

  static async createBranch(restaurantId: string, data: BranchFormData) {
    const validatedData = BranchSchema.parse(data);
    return BranchRepository.createBranch(restaurantId, validatedData);
  }

  static async updateBranch(id: string, data: BranchFormData) {
    const validatedData = BranchSchema.parse(data);
    return BranchRepository.updateBranch(id, validatedData);
  }

  static async deleteBranch(id: string) {
    return BranchRepository.deleteBranch(id);
  }
}
