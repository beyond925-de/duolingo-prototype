#!/usr/bin/env node

/**
 * Validate all company configs against the schema
 * Usage: node scripts/validate-all-configs.js
 */

const fs = require("fs");
const path = require("path");

const CONFIGS_DIR = path.join(__dirname, "..", "configs");

function validateColor(color, fieldName) {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  if (!hexPattern.test(color)) {
    return `${fieldName} must be hex format (e.g., #FF5733), got: ${color}`;
  }
  return null;
}

function validateConfig(filePath) {
  const errors = [];
  const relativePath = path.relative(process.cwd(), filePath);

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const config = JSON.parse(content);

    // Required top-level fields
    const requiredFields = ["company", "landing", "campus", "jobs", "copy"];
    const missing = requiredFields.filter((field) => !config[field]);

    if (missing.length > 0) {
      errors.push(`Missing required top-level fields: ${missing.join(", ")}`);
    }

    // Validate state field if present
    if (config.state !== undefined) {
      const validStates = ["published", "unpublished", "draft"];
      if (!validStates.includes(config.state)) {
        errors.push(
          `state must be one of: ${validStates.join(", ")}, got: ${config.state}`
        );
      }
    }

    // Validate company
    if (config.company) {
      const companyRequired = [
        "name",
        "slug",
        "logoUrl",
        "primaryColor",
        "secondaryColor",
        "city",
        "website",
        "industryVibe",
      ];
      const companyMissing = companyRequired.filter(
        (field) => !config.company[field]
      );

      if (companyMissing.length > 0) {
        errors.push(
          `Company missing required fields: ${companyMissing.join(", ")}`
        );
      }

      // Validate slug format (lowercase, alphanumeric, hyphens only)
      if (config.company.slug) {
        const slugPattern = /^[a-z0-9-]+$/;
        if (!slugPattern.test(config.company.slug)) {
          errors.push(
            `company.slug must be lowercase alphanumeric with hyphens only, got: ${config.company.slug}`
          );
        }
      }

      // Validate colors
      if (config.company.primaryColor) {
        const colorError = validateColor(
          config.company.primaryColor,
          "company.primaryColor"
        );
        if (colorError) errors.push(colorError);
      }

      if (config.company.secondaryColor) {
        const colorError = validateColor(
          config.company.secondaryColor,
          "company.secondaryColor"
        );
        if (colorError) errors.push(colorError);
      }

      // Validate industryVibe length
      if (
        config.company.industryVibe &&
        config.company.industryVibe.length < 10
      ) {
        errors.push(
          `company.industryVibe must be at least 10 characters (got ${config.company.industryVibe.length})`
        );
      }

      // Validate organizationFacts if present
      if (config.company.organizationFacts) {
        if (!Array.isArray(config.company.organizationFacts)) {
          errors.push("company.organizationFacts must be an array");
        } else {
          config.company.organizationFacts.forEach((fact, idx) => {
            if (!fact.title || !fact.value || !fact.icon) {
              errors.push(
                `company.organizationFacts[${idx}] missing required fields (title, value, icon)`
              );
            }
          });
        }
      }
    }

    // Validate landing
    if (config.landing) {
      const landingRequired = ["headline", "subline", "startButtonText"];
      const landingMissing = landingRequired.filter(
        (field) => !config.landing[field]
      );

      if (landingMissing.length > 0) {
        errors.push(
          `Landing missing required fields: ${landingMissing.join(", ")}`
        );
      }
    }

    // Validate campus
    if (config.campus) {
      const campusRequired = ["headline", "subline"];
      const campusMissing = campusRequired.filter(
        (field) => !config.campus[field]
      );

      if (campusMissing.length > 0) {
        errors.push(
          `Campus missing required fields: ${campusMissing.join(", ")}`
        );
      }

      // Validate categories if present
      if (config.campus.categories) {
        if (!Array.isArray(config.campus.categories)) {
          errors.push("campus.categories must be an array");
        } else {
          config.campus.categories.forEach((cat, idx) => {
            if (!cat.id || !cat.title || !cat.jobId) {
              errors.push(
                `campus.categories[${idx}] missing required fields (id, title, jobId)`
              );
            }
          });
        }
      }
    }

    // Validate jobs
    if (!Array.isArray(config.jobs) || config.jobs.length === 0) {
      errors.push("jobs must be a non-empty array");
    } else {
      const jobIds = new Set();
      config.jobs.forEach((job, idx) => {
        const jobRequired = [
          "id",
          "title",
          "description",
          "icon",
          "color",
          "tags",
          "levels",
        ];
        const jobMissing = jobRequired.filter((field) => !job[field]);

        if (jobMissing.length > 0) {
          errors.push(
            `jobs[${idx}] missing required fields: ${jobMissing.join(", ")}`
          );
        }

        // Check for duplicate job IDs
        if (job.id) {
          if (jobIds.has(job.id)) {
            errors.push(`Duplicate job id: ${job.id}`);
          }
          jobIds.add(job.id);
        }

        // Validate job color
        if (job.color) {
          const colorError = validateColor(job.color, `jobs[${idx}].color`);
          if (colorError) errors.push(colorError);
        }

        // Validate tags
        if (job.tags && !Array.isArray(job.tags)) {
          errors.push(`jobs[${idx}].tags must be an array`);
        }

        // Validate pathModeId enum
        if (job.pathModeId) {
          const validModes = ["linear", "branching", "global-map"];
          if (!validModes.includes(job.pathModeId)) {
            errors.push(
              `jobs[${idx}].pathModeId must be one of: ${validModes.join(", ")}, got: ${job.pathModeId}`
            );
          }
        }

        // Validate levels
        if (!Array.isArray(job.levels) || job.levels.length === 0) {
          errors.push(`jobs[${idx}].levels must be a non-empty array`);
        } else {
          const levelIds = new Set();
          job.levels.forEach((level, levelIdx) => {
            if (level.id !== undefined) {
              if (levelIds.has(level.id)) {
                errors.push(
                  `jobs[${idx}].levels[${levelIdx}] duplicate level id: ${level.id}`
                );
              }
              levelIds.add(level.id);
            }

            if (!level.scenarios || !Array.isArray(level.scenarios)) {
              errors.push(
                `jobs[${idx}].levels[${levelIdx}] must have scenarios array`
              );
            } else {
              level.scenarios.forEach((scenario, scenIdx) => {
                if (!scenario.type) {
                  errors.push(
                    `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] missing type`
                  );
                }

                // Validate scenario types
                const validTypes = [
                  "single-select-correct",
                  "single-select-no-correct",
                  "single-select-or-text",
                  "multiple-select",
                  "text-field",
                  "llm-interactive",
                  "bento-grid",
                ];
                if (scenario.type && !validTypes.includes(scenario.type)) {
                  errors.push(
                    `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] invalid type: ${scenario.type}`
                  );
                }

                // Validate options for select types
                if (
                  ["single-select-correct", "multiple-select"].includes(
                    scenario.type
                  )
                ) {
                  if (!scenario.options || !Array.isArray(scenario.options)) {
                    errors.push(
                      `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] must have options array`
                    );
                  } else {
                    const correctCount = scenario.options.filter(
                      (opt) => opt.correct === true
                    ).length;
                    if (scenario.type === "single-select-correct") {
                      if (correctCount !== 1) {
                        errors.push(
                          `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] must have exactly one correct option (found ${correctCount})`
                        );
                      }
                    } else if (scenario.type === "multiple-select") {
                      if (correctCount === 0) {
                        errors.push(
                          `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] must have at least one correct option`
                        );
                      }
                    }
                  }
                }

                // Validate bento-grid facts
                if (scenario.type === "bento-grid") {
                  if (!scenario.facts || !Array.isArray(scenario.facts)) {
                    errors.push(
                      `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] bento-grid must have facts array`
                    );
                  } else if (scenario.facts.length === 0) {
                    errors.push(
                      `jobs[${idx}].levels[${levelIdx}].scenarios[${scenIdx}] bento-grid facts array cannot be empty`
                    );
                  }
                }
              });
            }
          });
        }
      });
    }

    // Validate copy
    if (config.copy) {
      const copyRequired = [
        "checkChances",
        "expressApply",
        "jobMerken",
        "submit",
        "submitSuccess",
        "victoryHeadline",
        "victorySubtext",
        "nudgeText",
        "firstName",
        "schoolType",
      ];
      const copyMissing = copyRequired.filter((field) => !config.copy[field]);

      if (copyMissing.length > 0) {
        errors.push(`Copy missing required fields: ${copyMissing.join(", ")}`);
      }
    }

    // Validate questionnaire if present
    if (config.questionnaire) {
      if (config.questionnaire.questions) {
        if (!Array.isArray(config.questionnaire.questions)) {
          errors.push("questionnaire.questions must be an array");
        } else if (config.questionnaire.questions.length === 0) {
          errors.push("questionnaire.questions must have at least one question");
        } else {
          config.questionnaire.questions.forEach((q, idx) => {
            if (!q.id || !q.question || !q.options) {
              errors.push(
                `questionnaire.questions[${idx}] missing required fields (id, question, options)`
              );
            } else {
              if (!Array.isArray(q.options) || q.options.length < 2) {
                errors.push(
                  `questionnaire.questions[${idx}].options must be an array with at least 2 items`
                );
              } else {
                q.options.forEach((opt, optIdx) => {
                  if (!opt.id || !opt.label || !opt.icon || !opt.score) {
                    errors.push(
                      `questionnaire.questions[${idx}].options[${optIdx}] missing required fields (id, label, icon, score)`
                    );
                  }
                });
              }
            }
          });
        }
      }
    }

    if (errors.length > 0) {
      return { file: relativePath, errors };
    }

    return null;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        file: relativePath,
        errors: [`Invalid JSON syntax: ${error.message}`],
      };
    }
    return {
      file: relativePath,
      errors: [`Error: ${error.message}`],
    };
  }
}

function main() {
  console.log("🔍 Validating all company configs...\n");

  const configDirs = fs
    .readdirSync(CONFIGS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const validationErrors = [];
  let validCount = 0;

  for (const dir of configDirs) {
    const configPath = path.join(CONFIGS_DIR, dir, "config.json");
    if (fs.existsSync(configPath)) {
      const error = validateConfig(configPath);
      if (error) {
        validationErrors.push(error);
      } else {
        console.log(`✅ ${dir}/config.json`);
        validCount++;
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Valid: ${validCount}`);
  console.log(`   Invalid: ${validationErrors.length}`);

  if (validationErrors.length > 0) {
    console.log(`\n❌ Validation Errors:\n`);
    validationErrors.forEach((error) => {
      console.log(`📁 ${error.file}:`);
      error.errors.forEach((err) => {
        console.log(`   ❌ ${err}`);
      });
      console.log();
    });
    process.exit(1);
  } else {
    console.log(`\n✅ All configs are valid!`);
    process.exit(0);
  }
}

main();

