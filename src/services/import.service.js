import path from "node:path";
import fs from "node:fs/promises";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { updateByField } from "../repositories/entity.repository.js";
import { updateUser } from "../repositories/user.repository.js";
import { updateUserAccount } from "../repositories/userAccount.repository.js";
import { updatePolicy } from "../repositories/policy.repository.js";
import LOB from "../models/lob.model.js";
import Carrier from "../models/carrier.model.js";
import Agent from "../models/agent.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function parseWithWorker(filePath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, "../workers/import.worker.js"),
      { workerData: { filePath } }
    );

    worker.once("message", (result) => {
      if (result.success) resolve(result.rows);
      else reject(new Error(result.error));
    });

    worker.once("error", reject);

    worker.once("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

function normalizeKey(key) {
  return String(key).trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function get(row, ...keys) {
  const normalizedRow = Object.keys(row).reduce((result, key) => {
    result[normalizeKey(key)] = row[key];
    return result;
  }, {});

  for (const key of keys) {
    const value = normalizedRow[normalizeKey(key)];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return null;
}

function toDate(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  return number;
}

function toBoolean(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["true", "yes", "1", "active"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "0", "inactive"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid Boolean value: ${value}`);
}

async function importFile(filePath) {

  console.log("4. importFile started:", filePath);

  try {
    const rows = await parseWithWorker(filePath);

    console.log("5. Rows parsed:", rows.length);
    console.log("6. First row:", rows[0]);

    let imported = 0;
    const errors = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      try {
        const firstName = get(row,"firstname","first name","username");

        const applicantId = get(row,"Applicant ID","applicant_id");

        const policyNumber = get(row,"policy_number","policy number");

        const categoryName = get(row,"category_name","categoryName","policy category");

        const companyName = get(row, "company_name", "companyName");

        const agentName = get(row, "agent", "agentName", "agent name");
        
        const agencyId = get(row, "agency_id", "agency id");

        const accountName = get( row, "account_name", "accountName", "account name");

        const accountType = get( row, "account_type", "account type");

        const requiredFields = {
              firstName,
              policyNumber,
              categoryName,
              companyName,
              accountName,
              accountType,
              agentName,
            };

            const missingFields = Object.entries(requiredFields)
              .filter(([, value]) =>
                value === null ||
                value === undefined ||
                String(value).trim() === ""
              )
              .map(([field]) => field);

            if (missingFields.length > 0) {
              throw new Error(
                `Missing required fields: ${missingFields.join(", ")}`
              );
            }

        const email = get(row, "email");

        const userMatch = applicantId
          ? { applicantId }
          : email
            ? { email: String(email).trim().toLowerCase() }
            : { firstName: String(firstName).trim() };

        const user = await updateUser(userMatch, {
              applicantId: applicantId || null,
              firstName,
              dob: toDate(get(row, "dob", "date of birth")),
              address: get(row, "address"),
              city: get(row, "city"),
              phoneNumber: get(row, "phone", "phoneNumber", "phone number"),
              state: get(row, "state"),
              zipCode: get(row, "zip", "zipCode", "zip code"),
              email: email || null,
              gender: get(row, "gender"),
              userType: get(row, "userType", "user type"),
              agencyId: agencyId || null,
        });

        const category = await updateByField(
          LOB,
          "categoryName",
          categoryName,
          { categoryName }
        );

        const company = await updateByField(
          Carrier,
          "company_name",
          companyName,
          { company_name: companyName }
        );

        let agentId;

        if (agentName) {
          const agent = await updateByField(
            Agent,
            "agentName",
            agentName,
            {
              agentName,
              agencyId: agencyId || null,
            }
          );

          agentId = agent._id;
        }

        let accountId;

        if (accountName) {
          const account = await updateUserAccount(
            accountName,
            user._id,
            accountType
          );

          accountId = account._id;
        }

        const startDate = toDate(
          get(row, "policy_start_date", "policyStartDate", "policy start date")
        );

        const endDate = toDate(
          get(row, "policy_end_date", "policyEndDate", "policy end date")
        );

        if (startDate && endDate && startDate > endDate) {
          throw new Error(
            "Policy start date must not be after end date"
          );
        }

        await updatePolicy({
          policyNumber,
          policyStartDate: startDate,
          policyEndDate: endDate,
          policyCategoryId: category._id,
          companyId: company._id,
          userId: user._id,

          policyMode: get(row, "policy_mode", "policy mode"),

          premiumAmountWritten: toNumber(
            get(row, "premium_amount_written")
          ),

          premiumAmount: toNumber(
            get(row, "premium_amount")
          ),

          policyType: get(row, "policy_type", "policy type"),
          producer: get(row, "producer"),
          csr: get(row, "csr"),

          hasActiveClientPolicy: toBoolean(
            get(row, "hasActive ClientPolicy", "hasActiveClientPolicy")
          ),

          ...(agentId && { agentId }),
          ...(accountId && { accountId }),
        });

        imported++;
      } catch (error) {
        // errors.push({
        //   row: index + 2,
        //   message: error.message,
        // });

        console.error(`Error processing row ${index + 2}:`, error);
        errors.push({
          row: index + 2,
          message: error.message,
        });

      }
    }

    return {
      totalRows: rows.length,
      imported,
      failed: errors.length,
      errors,
    };
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}

export default { importFile };