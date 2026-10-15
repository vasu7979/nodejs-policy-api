import * as policyRepository from "../repositories/policy.repository.js";

export async function searchByUsername(username) {
  if (!username || !username.trim()) {
    const error = new Error("Username is required");
    error.statusCode = 400;
    throw error;
  }

  return policyRepository.findPoliciesByUsername(username.trim());
}

export async function getPoliciesGroupedByUser() {
  return policyRepository.aggregatePoliciesByUser();
}

export default {
  searchByUsername,
  getPoliciesGroupedByUser,
};