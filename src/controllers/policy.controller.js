import policyService from "../services/policy.service.js";

export async function searchPolicies(req, res, next) {
  try {
    const policies = await policyService.searchByUsername(
      req.query.username
    );

    return res.status(200).json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    next(error);
  }
}

export async function aggregatePolicies(req, res, next) {
  try {
    const data = await policyService.getPoliciesGroupedByUser();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
}