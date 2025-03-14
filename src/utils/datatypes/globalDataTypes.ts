/* eslint-disable @typescript-eslint/no-explicit-any */

export interface User {
  [key: string]: unknown; // to fulfill Record<string, unknown> type
  // identity
  title: string;
  givenname: string; // required
  sn: string; // required
  displayname: string;
  initials: string;
  gecos: string;
  userclass: string[]; // multivalue
  // account
  uid: string; // required
  has_password: boolean;
  krbpasswordexpiration: Date | string | null; // string | any[]; // TODO; Remove 'string' when 'staged' and 'preserved' are adapted
  uidnumber: string;
  gidnumber: string;
  krbprincipalname: string[]; // multivalue
  krbprincipalexpiration: Date | string | null; // TODO; Remove 'string' when 'staged' and 'preserved' are adapted
  loginshell: string;
  homedirectory: string;
  ipasshpubkey: string[]; // multivalue
  usercertificate: string[]; // multivalue
  ipacertmapdata: string[]; // multivalue
  ipauserauthtype: string[]; // multivalue
  ipatokenradiusconfiglink: string;
  ipatokenradiususername: string;
  ipaidpconfiglink: string;
  ipaidpsub: string;
  // pwpolicy
  krbmaxpwdlife: string;
  krbminpwdlife: string;
  krbpwdhistorylength: string;
  krbpwdmindiffchars: string;
  krbpwdminlength: string;
  krbpwdmaxfailure: string;
  krbpwdfailurecountinterval: string;
  krbpwdlockoutduration: string;
  passwordgracelimit: string;
  // krbtpolicy
  krbmaxrenewableage: string;
  krbmaxticketlife: string;
  // contact
  mail: string[]; // multivalue
  telephonenumber: string[]; // multivalue
  pager: string[]; // multivalue
  mobile: string[]; // multivalue
  facsimiletelephonenumber: string[]; // multivalue
  // mailing
  street: string;
  l: string;
  st: string;
  postalcode: string;
  // employee
  ou: string;
  manager: string;
  departmentnumber: string[]; // multivalue
  employeenumber: string;
  employeetype: string;
  preferredlanguage: string;
  // misc
  carlicense: string[]; // multivalue
  // smb_attributes
  ipantlogonscript: string;
  ipantprofilepath: string;
  ipanthomedirectory: string;
  ipanthomedirectorydrive: string;
  // 'Member of' data
  memberof_group: string[]; // multivalue
  memberof_netgroup: string[]; // multivalue
  memberof_role: string[]; // multivalue
  memberof_hbacrule: string[]; // multivalue
  memberof_sudorule: string[]; // multivalue
  memberof_subid: string[]; // multivalue
  // Indirect membership
  memberofindirect_group: string[]; // multivalue
  memberofindirect_netgroup: string[]; // multivalue
  memberofindirect_role: string[]; // multivalue
  memberofindirect_hbacrule: string[]; // multivalue
  memberofindirect_sudorule: string[]; // multivalue
  memberofindirect_subid: string[]; // multivalue
  // 'Managed by' data
  mepmanagedentry: string[];
  // other
  cn: string; // required
  krbcanonicalname: string[];
  nsaccountlock: boolean; // status (Enable: False | Disabled: True)
  objectclass: any[];
  ipauniqueid: string;
  ipantsecurityidentifier: string;
  attributelevelrights: Record<string, unknown>; // Generic, any type of object
  has_keytab: boolean;
  preserved: boolean;
  dn: string;
  sshpubkeyfp: string[]; // multivalue
  krbextradata: string;
  krblastadminunlock: Date | string | null;
  krblastfailedauth: Date | string | null;
  krblastpwdchange: Date | string | null;
  krbloginfailedcount: string;
}

export interface PwPolicy {
  attributelevelrights: Record<string, unknown>;
  cospriority: string;
  cn: string;
  dn: string;
  krbmaxpwdlife: string;
  krbminpwdlife: string;
  krbpwdfailurecountinterval: string;
  krbpwdhistorylength: string;
  krbpwdlockoutduration: string;
  krbpwdmaxfailure: string;
  krbpwdmindiffchars: string;
  krbpwdminlength: string;
  passwordgracelimit: string;
  ipapwdmaxrepeat: string;
  ipapwdmaxsequence: string;
  ipapwddictcheck: string;
  ipapwdusercheck: string;
}

export interface KrbPolicy {
  attributelevelrights: Record<string, unknown>;
  cn: string;
  ipacertmapdata: string[];
  ipantsecurityidentifier: string;
  ipasshpubkey: string[];
  ipauniqueid: string;
  krbcanonicalname: string;
  krbmaxrenewableage: string;
  krbmaxticketlife: string;
  krbprincipalexpiration: Date | string | null; // TODO: Remove 'string' when 'staged' and 'preserved' are adapted
  krbprincipalname: string[];
  loginshell: string;
  mail: string[];
  memberof: string;
  mepmanagedentry: string;
  usercertificatebinary: string[];
}

export interface UserGroupOld {
  name: string;
  gid: string;
  description: string;
}

export interface UserGroup {
  cn: string;
  gidnumber: string;
  description: string;
  dn: string;
  member: string[];
  objectclass: string[];
  // Member
  member_user: string[];
  memberindirect_user: string[];
  member_group: string[];
  memberindirect_group: string[];
  member_service: string[];
  memberindirect_service: string[];
  member_external: string[];
  member_idoverrideuser: string[];
  memberindirect_idoverrideuser: string[];
  // 'Member of' data
  memberof_group: string[]; // multivalue
  memberof_netgroup: string[]; // multivalue
  memberof_role: string[]; // multivalue
  memberof_hbacrule: string[]; // multivalue
  memberof_sudorule: string[]; // multivalue
  memberof_subid: string[]; // multivalue
  // Indirect membership
  memberofindirect_group: string[]; // multivalue
  memberofindirect_netgroup: string[]; // multivalue
  memberofindirect_role: string[]; // multivalue
  memberofindirect_hbacrule: string[]; // multivalue
  memberofindirect_sudorule: string[]; // multivalue
  memberofindirect_subid: string[]; // multivalue
  // Member managers
  membermanager_group: string[];
  membermanager_user: string[];
}

export interface NetgroupOld {
  name: string;
  description: string;
}

export interface Netgroup {
  cn: string;
  nisdomainname: string;
  description: string;
  dn: string;
  memberof_netgroup: string[];
  member_netgroup: string[];
  memberhost_host: string[];
  memberhost_hostgroup: string[];
  memberuser_user: string[];
  memberuser_group: string[];
  memberindirect_netgroup: string[];
  externalhost: string[];
  usercategory: string;
  hostcategory: string;
}

export interface RolesOld {
  name: string;
  description: string;
}

export interface Role {
  cn: string;
  description: string;
  dn: string;
}

export interface HBACRulesOld {
  name: string;
  status: string;
  description: string;
}

export interface HBACRule {
  hostcategory: string;
  servicecategory: string;
  description: string;
  usercategory: string;
  cn: string;
  ipaenabledflag: boolean;
  dn: string;
  memberhost_host: string[];
  memberhost_hostgroup: string[];
  memberuser_user: string[];
  memberuser_group: string[];
  memberservice_hbacsvc: string[];
  memberservice_hbacsvcgroup: string[];
}

export interface HBACService {
  description: string;
  cn: string;
  dn: string;
  memberof_hbacsvcgroup: string[];
}

export interface HBACServiceGroup {
  description: string;
  cn: string;
  dn: string;
  member_hbacsvc: string[];
}

export interface SudoRulesOld {
  name: string;
  status: string;
  description: string;
}

export interface SudoRule {
  cn: string;
  ipaenabledflag: boolean;
  externaluser: string[];
  dn: string;
  description: string;
  sudoorder: string;
  usercategory: string;
  hostcategory: string;
  cmdcategory: string;
  memberuser_user: string[];
  memberuser_group: string[];
  memberhost_host: string[];
  memberhost_hostgroup: string[];
  memberallowcmd_sudocmd: string[];
  memberallowcmd_sudocmdgroup: string[];
  memberdenycmd_sudocmd: string[];
  memberdenycmd_sudocmdgroup: string[];
  ipasudoopt: string[];
  ipasudorunas_user: string[];
  ipasudorunas_group: string[];
  ipasudorunasgroup_group: string[];
  ipasudorunasusercategory: string;
  ipasudorunasgroupcategory: string;
  hostmask: string;
  externalhost: string[];
  ipasudorunasextusergroup: string[];
  ipasudorunasextgroup: string[];
  ipasudorunasextuser: string[];
}

export interface SudoCmd {
  dn: string;
  sudocmd: string;
  description: string;
  memberof_sudocmdgroup: string[];
}
export interface SudoCmdGroup {
  cn: string;
  dn: string;
  description: string;
  member_sudocmd: string[];
}

export interface Host {
  dn: string;
  attributelevelrights: Record<string, unknown>;
  description: string;
  dnsZone: string;
  enrolledby: string;
  fqdn: string;
  ip_address: string;
  nshardwareplatform: string;
  nsosversion: string;
  krbcanonicalname: string;
  krbprincipalname: string[];
  krbpwdpolicyreference: string[];
  l: string;
  managedby_host: string[];
  memberof_hostgroup: string[];
  memberof_netgroup: string[];
  memberof_role: string[];
  memberof_hbacrule: string[];
  memberof_sudorule: string[];
  memberofindirect_hostgroup: string[];
  memberofindirect_netgroup: string[];
  memberofindirect_role: string[];
  memberofindirect_hbacrule: string[];
  memberofindirect_sudorule: string[];
  managing_host: string[];
  nshostlocation: string;
  userclass: string;
  serverhostname: string;
  sshpubkeyfp: string[];
  sshpublickey: string[];
  macaddress: string[];
  krbprincipalauthind: string[];
  usercertificate: string[];
  // Booleans
  force: boolean; // force host name even if not in DNS
  has_keytab: boolean;
  has_password: boolean;
  ipakrbrequirespreauth: boolean;
  ipakrbokasdelegate: boolean;
  ipakrboktoauthasdelegate: boolean;
}

export interface HostGroupOld {
  name: string;
  description: string;
}

export interface HostGroup {
  dn: string;
  cn: string;
  description: string;
  membermanager_user: string[];
  membermanager_group: string[];
  // Member
  member_host: string[];
  member_hostgroup: string[];
  memberindirect_host: string[];
  memberindirect_hostgroup: string[];
  // MemberOf
  memberof_hostgroup: string[];
  memberof_netgroup: string[];
  memberof_hbacrule: string[];
  memberof_sudorule: string[];
  memberofindirect_hostgroup: string[];
  memberofindirect_hbacrule: string[];
  memberofindirect_sudorule: string[];
}

export interface Service {
  serviceType: string;
  dn: string;
  has_keytab: boolean;
  ipauniqueid: string;
  krbextradata: string[];
  krblastpwdchange: Date | string | null;
  krbloginfailedcount: string;
  krbpwdpolicyreference: string;
  krbticketflags: string[];
  krbcanonicalname: string;
  krbprincipalname: string[];
  krbprincipalauthind: string[];
  sshpublickey: string[];
  usercertificate: string[];
  ipakrbauthzdata: string[]; // pac_type: MS-PAC, PAD, NONE
  memberof_role: string[];
  managedby_host: string[];
  ipakrbrequirespreauth: boolean;
  ipakrbokasdelegate: boolean;
  ipakrboktoauthasdelegate: boolean;
}

export interface IDView {
  dn: string;
  cn: string;
  description: string;
  ipadomainresolutionorder: string;
  useroverrides: string[];
  groupoverrides: string[];
  appliedtohosts: string[];
}

export interface IDViewOverrideUser {
  dn: string;
  cn: string;
  description: string;
  homedirectory: string;
  gecos: string;
  gidnumber: string;
  ipaanchoruuid: string;
  ipaoriginaluid: string;
  ipasshpubkey: string[];
  loginshell: string;
  uid: string;
  uidnumber: string;
  usercertificate: string[];
  // Membership
  memberof_group: string[];
  memberof_role: string[];
  memberofindirect_group: string[];
  memberofindirect_role: string[];
}

export interface IDViewOverrideGroup {
  dn: string;
  cn: string;
  description: string;
  gidnumber: string;
  ipaanchoruuid: string;
  appliedtohosts: string[];
}

export interface Config {
  dn: string;
  cn: string;
  ipamaxusernamelength: string;
  ipahomesrootdir: string;
  ipadefaultloginshell: string;
  ipadefaultprimarygroup: string;
  ipadefaultemaildomain: string;
  ipasearchtimelimit: string;
  ipasearchrecordslimit: string;
  ipausersearchfields: string;
  ipagroupsearchfields: string;
  ipacertificatesubjectbase: string;
  ipapwdexpadvnotify: string;
  ipaselinuxusermapdefault: string;
  ipadomainresolutionorder: string;
  ipamaxhostnamelength: string;
  ipaselinuxusermaporder: string;
  ca_renewal_master_server: string;
  ipaconfigstring: string[];
  ipakrbauthzdata: string[];
  ipauserauthtype: string[];
  ipagroupobjectclasses: string[];
  ipauserobjectclasses: string[];
  ca_server_server: string[];
  kra_server_server: string[];
  ipa_master_server: string[];
  pkinit_server_server: string[];
  dns_server_server: string[];
  ipamigrationenabled: boolean;
  ipauserdefaultsubordinateid: boolean;
}

// Errors
export interface ErrorData {
  code: string;
  name: string;
  error: string;
}

// Identity Provider server
export interface IDPServer {
  cn: string;
  dn: string;
  ipaidpauthendpoint: string;
  ipaidpclientid: string[];
  ipaidpdevauthendpoint: string[];
  ipaidpscope: string;
  ipaidpsub: string;
  ipaidptokenendpoint: string;
  ipaidpuserinfoendpoint: string[];
}

export interface Metadata {
  commands?: Record<string, unknown>;
  methods?: Record<string, unknown>;
  objects?: ObjectsMetadata;
}

export interface ObjectsMetadata {
  [key: string]: ObjectMetadata;
}

export interface ObjectMetadata {
  name: string;
  aciattrs?: string[];
  attribute_members?: { [key: string]: string[] };
  bindable?: boolean;
  can_have_permissions?: boolean;
  takes_params: ParamMetadata[];
  [key: string]: unknown; // TODO add missing properties
}

export interface ParamMetadata {
  alwaysask: boolean;
  attribute: boolean;
  autofill: boolean;
  class: string;
  cli_metavar: string;
  cli_name: string;
  confirm: boolean;
  deprecated_cli_aliases: string[];
  deprecated: boolean;
  doc: string;
  flags: string[];
  label: string;
  maxlength: number;
  multivalue: boolean;
  name: string;
  no_convert: boolean;
  noextrawhitespace: boolean;
  pattern_errmsg: string;
  pattern: string;
  primary_key: boolean;
  query: boolean;
  required: boolean;
  sortorder: number;
  type: string;
}

export interface RadiusServer {
  ipatokenradiusserver: string;
  cn: string;
  dn: string;
}

export interface Certificate {
  cacn?: string;
  certificate_chain?: string[];
  serial_number: string;
  certificate: string;
  subject: string;
  issuer: string;
  serial_number_hex: string;
  valid_not_before: string;
  valid_not_after: string;
  sha1_fingerprint: string;
  sha256_fingerprint: string;
  san_rfc822name?: string[];
  owner_user: string[];
  revocation_reason?: number;
  revoked?: boolean;
  status?: string;
}

export interface DN {
  c: string;
  cn: string;
  o: string;
  ou?: string;
}

export interface CertificateAuthority {
  cn: string[];
  description: string[];
  dn: string;
  ipacaid: string[];
  ipacaissuerdn: string[];
  ipacarandomserialnumberversion: string[];
  ipacasubjectdn: string[];
}

export interface UIDType {
  dn: string;
  uid: string[];
}

export interface cnType {
  dn: string;
  cn: string[];
}

export interface groupType {
  dn: string;
  cn: string[];
  description: string;
  gidnumber?: string;
}

export interface fqdnType {
  dn: string;
  fqdn: string[];
}

export interface servicesType {
  dn: string;
  krbprincipalname: string[];
}

export interface roleType {
  dn: string;
  cn: string[];
  description: string;
}

export interface sudoCmdType {
  dn: string;
  sudocmd: string;
  description: string;
}

export interface automemberType {
  cn: string;
  automembertargetgroup: string;
  dn: string;
  description?: string;
}

export interface CertProfile {
  cn: string;
  description: string;
  ipacertprofilestoreissued: boolean;
  dn: string;
}

export interface OTPToken {
  ipatokenotpalgorithm: string;
  ipatokenuniqueid: string;
  ipatokenotpkey: string;
  ipatokenowner: string;
  ipatokentotptimestep: string;
  ipatokentotpclockoffset: string;
  ipatokenotpdigits: string;
  uri: string;
  type: string;
  dn: string;
}

export interface SubId {
  ipauniqueid: string;
  ipaowner: string;
  ipasubgidnumber?: string;
  ipasubuidnumber?: string;
  description?: string;
  ipasubuidcount?: string;
  ipasubgidcount?: string;
  dn: string;
}

export interface DNSZone {
  idnsname: string;
}

export interface Automember {
  cn: string;
  description: string;
  automemberdefaultgroup: string;
  automemberinclusiveregex: string[];
  automemberexclusiveregex: string[];
  member: string[];
  no_member: string[];
  in_memberof: string[];
  not_in_memberof: string[];
  memberindirect: string[];
  memberofindirect: string[];
  membermanager: string[];
}

export type AutomemberEntry = {
  automemberRule: string;
  description: string;
};

export interface KrbTicket {
  uid: string;
  cn: string;
  krbauthindmaxticketlife_otp: string;
  krbauthindmaxrenewableage_otp: string;
  krbauthindmaxticketlife_radius: string;
  krbauthindmaxrenewableage_radius: string;
  krbauthindmaxticketlife_pkinit: string;
  krbauthindmaxrenewableage_pkinit: string;
  krbauthindmaxticketlife_hardened: string;
  krbauthindmaxrenewableage_hardened: string;
  krbauthindmaxticketlife_idp: string;
  krbauthindmaxrenewableage_idp: string;
  krbauthindmaxticketlife_passkey: string;
  krbauthindmaxrenewableage_passkey: string;
  objectclass: string[];
  krbsubtrees: string;
  krbsearchscope: string;
  krbsupportedencsalttypes: string[];
  krbdefaultencsalttypes: string[];
  krbpwdpolicyreference: string;
  krbmaxticketlife: string;
  krbmaxrenewableage: string;
  aci: string[];
  dn: string;
}
