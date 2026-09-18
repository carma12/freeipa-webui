import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("permission {string} exists", (permissionName: string) => {
  cy.ipa({
    command: "permission-add",
    name: permissionName,
    specificOptions: "--right=read --type=user --attrs=uid",
  });
});

Given(
  "permission {string} exists with right {string} and type {string}",
  (permissionName: string, right: string, type: string) => {
    cy.ipa({
      command: "permission-add",
      name: permissionName,
      specificOptions: `--right=${right} --type=${type} --attrs=uid`,
    });
  }
);

Given(
  "permission {string} exists with subtree {string}",
  (permissionName: string, subtree: string) => {
    cy.ipa({
      command: "permission-add",
      name: permissionName,
      specificOptions: `--right=read --subtree="${subtree}" --attrs=uid`,
    });
  }
);

Given("I delete permission {string}", (permissionName: string) => {
  cy.ipa({
    command: "permission-del",
    name: permissionName,
  });
});
