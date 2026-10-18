// The inputs of the MCP tools the session had connected when this mod
// was last saved, from each server's tools/list inputSchema.
// Merges into the engine's ToolCallInput (types/ McpToolInputs) so
// `e.tool === "mcp__<server>__<tool>"` narrows to the tool's arguments.
// Written again at a save of the mod with a server connected.
export {}
declare module 'claude-code' {
  interface McpToolInputs {
    /** Create a doc, or apply several operations to one doc atomically. */
    mcp__claude_ai_Claude_Docs__batch: {
      batch?: unknown[]
      container?: {
        kind: string
        id?: string
        create?: {}
      }
      verbose?: boolean
      opId?: string
    }
    /** Create one object in a doc: a tab, its contents, a comment, an upload record. */
    mcp__claude_ai_Claude_Docs__create: {
      object: "file" | "node" | "utterance" | "enum" | "blob"
      engine?: string
      payload: {} | string
      container?: {
        kind: string
        id: string
        version?: string
      }
      verbose?: boolean
      opId?: string
      artifact?: string
    }
    /** Delete one object from a doc: a tab, its contents, a comment, an upload record. A doc keeps at least one tab (deleting its last refuses `last_tab`): to start over, rewrite that tab's contents with `update`, never delete and recreate the tab. */
    mcp__claude_ai_Claude_Docs__delete: {
      ref: {
        object: "project" | "file" | "node" | "utterance"
        id: string
      }
      engine?: string
      container?: {
        kind: string
        id: string
        version?: string
      }
      payload?: {} | string
      verbose?: boolean
      opId?: string
    }
    /** Export one tab inline as base64: pdf, docx, html, text, markdown or notion (Notion-flavored markdown, what notion-create-pages takes). To just keep the file in the doc's files, create a blob {from: {object: "file", id}, format} instead (no large result). */
    mcp__claude_ai_Claude_Docs__export: {
      container: {
        kind: string
        id: string
        version?: string
      }
      file: string
      format: "markdown" | "text" | "html" | "docx" | "pdf" | "notion"
      paper?: "letter" | "a4"
      maxBytes?: number
    }
    /** Docs guides: topic.instructions repeats the server instructions. Read it only if your client dropped them. Also topic.<name>, refusal.<code>. After a doc's birth → ["topic.index"]. */
    mcp__claude_ai_Claude_Docs__guide: {
      /** topic.<name> (instructions, index, editing, tabs, comments, charts, chart-definition, diagram, uploads, sharing, skill) or refusal.<code>; several per call is fine. */
      items?: unknown[]
    }
    /** List a tab's or a doc's comment history (threads, replies, resolves). */
    mcp__claude_ai_Claude_Docs__query: {
      container?: {
        kind: string
        id: string
        version?: string
      }
      object?: "utterance"
      payload?: {} | string
    }
    /** Read a doc (lists its tabs), a tab's contents, or a comment. A claude.ai/[code/]artifact/[<title>-]<id> link → `ref {"object":"project","id":"<id>"}` first; reads inside it take `container {"kind":"project","id":"<id>"}`. */
    mcp__claude_ai_Claude_Docs__read: {
      ref: {
        object: "project" | "file" | "node" | "utterance" | "enum" | "blob"
        id: string
      }
      engine?: string
      container?: {
        kind: string
        id: string
        version?: string
      }
      payload?: {} | string
    }
    /** Edit a tab's contents, rename a doc or tab, or change a stored value. */
    mcp__claude_ai_Claude_Docs__update: {
      ref: {
        object: "project" | "file" | "node" | "utterance" | "enum"
        id: string
      }
      engine?: string
      payload: {} | string
      container?: {
        kind: string
        id: string
        version?: string
      }
      verbose?: boolean
      opId?: string
      answering?: string
    }
    /** Retrieves and queries up-to-date documentation and code examples from Context7 for any programming library or framework. You must call 'Resolve Context7 Library ID' tool first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query. Do not call this tool more than 3 times per question. If you know the programming language the user is working in, pass it as `language` so the results match their setup. */
    "mcp__claude_ai_Context7__query-docs": {
      /** Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v16.2.9') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'. */
      libraryId: string
      /** What to look up in the library's documentation, scoped to a single concept. Be specific and include relevant details, but keep each query to one topic — if the user's question spans multiple distinct concepts, make a separate call per concept instead of combining them, unless the question is about how the concepts interact. Good: 'How to set up authentication with JWT in Express.js' or 'React useEffect cleanup function examples'. Bad (too vague): 'auth' or 'hooks'. Bad (too broad): 'routing and auth and caching in Next.js'. The query is sent to the Context7 API for processing. Do not include any sensitive or confidential information such as API keys, passwords, credentials, personal data, or proprietary code in your query. */
      query: string
      /** Programming language the user is writing code in, such as 'Python', 'TypeScript', 'Go', or 'C#'. Ranks code examples in that language first. Leave it out when the language is unknown or does not apply. */
      language?: string
    }
    /** Resolves a package/product name to a Context7-compatible library ID and returns matching libraries. You MUST call this function before 'Query Documentation' tool to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query. Each result includes: - Library ID: Context7-compatible identifier (format: /org/project) - Name: Library or package name - Description: Short summary - Code Snippets: Number of available code examples - Source Reputation: Authority indicator (High, Medium, Low, or Unknown) - Benchmark Score: Quality indicator (100 is the highest score) - Versions: List of versions if available. Use one of those versions if the user provides a version in their query. The format of the version is /org/project/version. For best results, select libraries based on name match, source reputation, snippet coverage, benchmark score, and relevance to your use case. Selection Process: 1. Analyze the query to understand what library/package the user is looking for 2. Return the most relevant match based on: - Name similarity to the query (exact matches prioritized) - Description relevance to the query's intent - Documentation coverage (prioritize libraries with higher Code Snippet counts) - Source reputation (consider libraries with High or Medium reputation more authoritative) - Benchmark Score: Quality indicator (100 is the highest score) Response Format: - Return the selected library ID in a clearly marked section - Provide a brief explanation for why this library was chosen - If multiple good matches exist, acknowledge this but proceed with the most relevant one - If no good matches exist, clearly state this and suggest query refinements For ambiguous queries, request clarification before proceeding with a best-guess match. IMPORTANT: Do not call this tool more than 3 times per question. If you cannot find what you need after 3 calls, use the best result you have. */
    "mcp__claude_ai_Context7__resolve-library-id": {
      /** What to look up in the library's documentation. This is used to rank library results by relevance to what the user is trying to accomplish. The query is sent to the Context7 API for processing. Do not include any sensitive or confidential information such as API keys, passwords, credentials, personal data, or proprietary code in your query. */
      query: string
      /** Library name to search for and retrieve a Context7-compatible library ID. Use the official library name with proper punctuation — e.g., 'Next.js' instead of 'nextjs', 'Customer.io' instead of 'customerio', 'Three.js' instead of 'threejs'. */
      libraryName: string
    }
    /** Accept a project ownership transfer into the selected team using its request code. Paid features can otherwise activate or increase billing on the receiving team; MCP explicitly opts out of those upgrades, including choices saved on the transfer request. Existing receiving-team entitlements still apply. Integration dependencies may require their own accepted policies and billing arrangements. Completion is asynchronous; inspect the project to verify ownership. CLI fallback on MCP failure (partial): vercel api /projects/transfer-request/{code} --method PUT. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__accept_project_transfer_request: {
      /** The code of the project transfer request. */
      code: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The desired name for the project */
        newProjectName?: string
        acceptedPolicies?: {}
      }
    }
    /** Activate a pending signing key so the issuer starts signing with it. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId}/keys/{keyId}/activate --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__activate_kms_signing_key: {
      /** The ID of the issuer. */
      issuerId: string
      /** The ID of the pending signing key to activate. */
      keyId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** How many hours after activation the previously-active key should stop being used. Defaults to a 1 hour grace period so already-issued tokens keep verifying. */
        revokePreviousAfterHours?: number
      }
    }
    /** Add a domain to the project by passing its domain name and by specifying the project by either passing the project `id` or `name` in the URL. If the domain is not yet verified to be used on this project, the request will return `verified = false`, and the domain will need to be verified according to the `verification` challenge via `POST /projects/:idOrName/domains/:domain/verify`. If the domain already exists on the project, the request will fail with a `400` status code. CLI fallback on MCP failure (partial): vercel api /v10/projects/{idOrName}/domains --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__add_project_domain: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The project domain name */
        name: string
        gitBranch?: string | null
        /** The unique custom environment identifier within the project */
        customEnvironmentId?: string
        redirect?: string | null
        redirectStatusCode?: null | 301 | 302 | 307 | 308 | null
      }
    }
    /** Add a single routing rule to a project at a specified position. Defaults to the end of the list if no position is provided. The route is enabled by default. Stages a new version with the added route. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__add_route: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        route: {
          name: string
          description?: string
          enabled?: boolean
          /** Pattern syntax type. If not provided, inferred from pattern. */
          srcSyntax?: "equals" | "path-to-regexp" | "regex"
          route: {
            src: string
            dest?: string
            headers?: {}
            caseSensitive?: boolean
            status?: number
            has?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            missing?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            transforms?: Array<{
              type?: "request.headers" | "request.query" | "response.headers"
              op?: "append" | "set" | "delete"
              target?: {}
              args?: unknown
              env?: string[]
            }>
            respectOriginCacheControl?: boolean
          }
        }
        /** Controls where the route is inserted. Defaults to "end" if omitted. */
        position?: {
          /** "after"/"before" require referenceId. */
          placement?: "start" | "end" | "after" | "before"
          /** Route ID to insert after/before. Required for "after"/"before". */
          referenceId?: string
        }
      }
    }
    /** Add an emoji reaction to a message in a toolbar thread. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__add_toolbar_reaction: {
      /** The thread ID containing the message */
      threadId: string
      /** The message ID to react to */
      messageId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The emoji to add as a reaction (e.g. 👍) */
      emoji: string
    }
    /** Counts custom events on a project, within the requested date range. Results are either aggregated or broken down over time. Results can additionally be broken down by one dimension, and filtered by multiple dimensions. CLI fallback on MCP failure (partial): vercel api /v1/query/web-analytics/events/aggregate --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__aggregate_events: {
      /** The project identifier or the project name */
      projectId: string
      /** Up to two dimensions used to break down results. At most one time granularity is allowed: hour, day, week, month, year. Other dimensions: country, deviceType, environment, requestPath, referrerHostname, osName, browserName, route, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, eventName. JSON dimensions: flags, eventData. Used bare, they break down results by key, for example flags returns one group per flag name. With a key, they break down results by that key's value, for example eventData/plan. Wrap keys containing characters other than letters, digits, and underscores in single quotes, for example flags/'my-flag'. */
      by: Array<string & ("hour" | "day" | "week" | "month" | "year" | "country" | "deviceType" | "environment" | "requestPath" | "referrerHostname" | "osName" | "browserName" | "route" | "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm" | "eventName" | "flags" | "eventData" | unknown)>
      /** Timestamp in milliseconds, or a valid Date string. Selects data from (including) this date and time. Will be adjusted according to the desired time granularity. */
      since: number | string
      /** Timestamp in milliseconds, or a valid Date string. Selects data until (including) this date. Will be adjusted according to the desired time granularity. */
      until: number | string
      /** Number of distinct results, default to 10. Other results are grouped into "Others" group. */
      limit?: number
      /** OData-compliant filter. Encode the value when sending it in a URL. Allows filtering on one or multiple dimensions. By default, filters for production environment only. Supported dimensions: country, deviceType, environment, requestPath, referrerHostname, osName, browserName, route, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, eventName. JSON dimensions filtered by key: flags/<name>, eventData/<property>, for example eventData/plan eq 'pro'. Wrap keys containing characters other than letters, digits, and underscores in single quotes, for example flags/'my-flag' eq 'true'. Supported operations include eq, ne, in, and logical operators and, or, not with parentheses. Functions such as startswith are supported by the OData parser. */
      filter?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Counts pageviews on a project, within the requested date range. Results are either aggregated or broken down over time. Results can additionally be broken down by one dimension, and filtered by multiple dimensions. CLI fallback on MCP failure (partial): vercel api /v1/query/web-analytics/visits/aggregate --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__aggregate_pageviews: {
      /** The project identifier or the project name */
      projectId: string
      /** Up to two dimensions used to break down results. At most one time granularity is allowed: hour, day, week, month, year. Other dimensions: country, deviceType, environment, requestPath, referrerHostname, osName, browserName, route, utmSource, utmMedium, utmCampaign, utmContent, utmTerm. JSON dimensions: flags. Used bare, it breaks down results by key, for example flags returns one group per flag name. With a key, it breaks down results by that key's value, for example flags/beta_banner. Wrap keys containing characters other than letters, digits, and underscores in single quotes, for example flags/'my-flag'. */
      by: Array<string & ("hour" | "day" | "week" | "month" | "year" | "country" | "deviceType" | "environment" | "requestPath" | "referrerHostname" | "osName" | "browserName" | "route" | "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm" | "flags" | unknown)>
      /** Timestamp in milliseconds, or a valid Date string. Selects data from (including) this date and time. Will be adjusted according to the desired time granularity. */
      since: number | string
      /** Timestamp in milliseconds, or a valid Date string. Selects data until (including) this date. Will be adjusted according to the desired time granularity. */
      until: number | string
      /** Number of distinct results, default to 10. Other results are grouped into "Others" group. */
      limit?: number
      /** OData-compliant filter. Encode the value when sending it in a URL. Allows filtering on one or multiple dimensions. By default, filters for production environment only. Supported dimensions: country, deviceType, environment, requestPath, referrerHostname, osName, browserName, route, utmSource, utmMedium, utmCampaign, utmContent, utmTerm. JSON dimensions filtered by key: flags/<name>, for example flags/beta_banner eq 'true'. Wrap keys containing characters other than letters, digits, and underscores in single quotes, for example flags/'my-flag' eq 'true'. Supported operations include eq, ne, in, and logical operators and, or, not with parentheses. Functions such as startswith are supported by the OData parser. */
      filter?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Advance a rollout to the next stage. This is only needed when rolling releases is configured to require manual approval. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release/approve-stage --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__approve_rolling_release_stage: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The index of the stage to transition to */
        nextStageIndex: number
        /** The id of the canary deployment to approve for the next stage */
        canaryDeploymentId: string
      }
    }
    /** Query information about an array of artifacts. CLI fallback on MCP failure (partial): vercel api /v8/artifacts --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__artifact_query: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** artifact hashes */
        hashes: string[]
      }
    }
    /** Creates a new alias for the deployment resolved from the given deployment or alias ID or URL. The authenticated user or team must own this deployment. If the desired alias is already assigned to another deployment, then it will be removed from the old deployment and assigned to the new one. CLI fallback on MCP failure (partial): vercel api /v2/deployments/{id}/aliases --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__assign_alias: {
      /** The deployment or alias ID or URL to assign from */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The alias we want to assign to the deployment defined in the URL */
        alias?: string
        redirect?: string | null
      }
    }
    /** Executes a single-domain registration previously quoted by get_purchase_quote (product:domain) — quoting first is REQUIRED; this tool rejects un-quoted calls. Get the quote, present it to the user for explicit approval (use a structured question tool such as AskUserQuestion when available), then call with confirm:true, the quote's idempotencyKey, the expectedPrice and years from the quote, and the full registrant contact to execute the non-refundable purchase. Vercel stores no reusable registrant profile, so contact details must be supplied each time. The quote returns required disclosures the assistant must relay before approval: the payment method (default card on file), that taxes/fees may apply on top of the price, the item terms (non-refundable), and, when auto-renew is on, the recurring-charge terms in disclosures.subscription (renews automatically each term at the then-current price until auto-renew is turned off), plus a full-terms link. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__buy_domain: {
      /** The domain to register, e.g. "example.com". */
      domain: string
      /** Registration term in years. Required on confirm — must match the term shown in the quote. */
      years?: number
      /** Whether to auto-renew at the end of the term. Defaults to true. */
      autoRenew?: boolean
      /** Required on confirm: the purchasePrice (USD) from the quote. The server rejects the order if it no longer matches the live price. */
      expectedPrice?: number
      /** Registrant (WHOIS) contact. Not needed for the quote; REQUIRED on confirm. All fields must be provided. */
      contact?: {
        firstName: string
        lastName: string
        email: string
        phone: string
        address1: string
        city: string
        state: string
        zip: string
        /** Two-letter ISO country code, e.g. US */
        country: string
        companyName?: string
      }
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** Set true to execute the purchase; requires the idempotencyKey from get_purchase_quote. */
      confirm?: boolean
      /** The idempotencyKey returned by get_purchase_quote. */
      idempotencyKey?: string
    }
    /** Cancels a deployment that is currently in progress, stopping the build before it completes. Use this to recover quickly from accidental deploys, wrong-branch pushes, or builds with known errors — without waiting for them to finish. Returns 400 if the deployment is no longer cancelable (already `READY`, `ERROR`, or `CANCELED`). Returns the updated deployment object with `readyState: 'CANCELED'` on success. CLI fallback on MCP failure (partial): vercel api /v12/deployments/{id}/cancel --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__cancel_deployment: {
      /** The unique identifier of the deployment. */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Change the resolve status of a toolbar thread. Can be used to mark a thread as resolved or unresolve a previously resolved thread. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__change_toolbar_thread_resolve_status: {
      /** The thread ID to update */
      threadId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** Set to true to resolve the thread, false to unresolve it */
      resolved: boolean
    }
    /** Force-complete a Rolling Release. The canary deployment will begin serving 100% of the traffic. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release/complete --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__complete_rolling_release: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The ID of the canary deployment to complete */
        canaryDeploymentId: string
      }
    }
    /** Counts the number of custom events on a project (production only), since Web Analytics was enabled. Results can be filtered on supported dimensions. CLI fallback on MCP failure (partial): vercel api /v1/query/web-analytics/events/count --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__count_events: {
      /** The project identifier or the project name */
      projectId: string
      /** Timestamp in milliseconds, or a valid Date string. Selects data from (including) this date and time. Will be adjusted according to the desired time granularity. */
      since?: number | string
      /** Timestamp in milliseconds, or a valid Date string. Selects data until (including) this date. Will be adjusted according to the desired time granularity. */
      until?: number | string
      /** OData-compliant filter. Encode the value when sending it in a URL. Allows filtering on one or multiple dimensions. Supported dimensions: country, deviceType, environment, requestPath, referrerHostname, osName, browserName, route, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, eventName. JSON dimensions filtered by key: flags/<name>, eventData/<property>, for example eventData/plan eq 'pro'. Wrap keys containing characters other than letters, digits, and underscores in single quotes, for example flags/'my-flag' eq 'true'. Supported operations include eq, ne, in, and logical operators and, or, not with parentheses. Functions such as startswith are supported by the OData parser. */
      filter?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Counts the number of page views on a project (production only), since Web Analytics was enabled. Results can be filtered on supported dimensions. CLI fallback on MCP failure (partial): vercel api /v1/query/web-analytics/visits/count --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__count_pageviews: {
      /** The project identifier or the project name */
      projectId: string
      /** Timestamp in milliseconds, or a valid Date string. Selects data from (including) this date and time. Will be adjusted according to the desired time granularity. */
      since?: number | string
      /** Timestamp in milliseconds, or a valid Date string. Selects data until (including) this date. Will be adjusted according to the desired time granularity. */
      until?: number | string
      /** OData-compliant filter. Encode the value when sending it in a URL. Allows filtering on one or multiple dimensions. Supported dimensions: country, deviceType, environment, requestPath, referrerHostname, osName, browserName, route, utmSource, utmMedium, utmCampaign, utmContent, utmTerm. JSON dimensions filtered by key: flags/<name>, for example flags/beta_banner eq 'true'. Wrap keys containing characters other than letters, digits, and underscores in single quotes, for example flags/'my-flag' eq 'true'. Supported operations include eq, ne, in, and logical operators and, or, not with parentheses. Functions such as startswith are supported by the OData parser. */
      filter?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Create a Vercel deployment from source files or an existing project Git connection. Git authentication uses the configured connection server-side; this tool does not accept a Git access token. Builds run asynchronously; inspect the deployment state and logs afterward. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} deploy {localProjectPath} --target {target}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_deployment: {
      /** Forces a new deployment even if there is a previous similar deployment. Set to `1` to bypass deployment deduplication and always trigger a fresh build. */
      forceNew?: "0" | "1"
      /** Set to `1` to skip framework auto-detection and proceed without confirmation. By default, if Vercel detects a framework that differs from the project setting, the API returns a `400` asking you to confirm. Use this to suppress that check in automated pipelines. */
      skipAutoDetectionConfirmation?: "0" | "1"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** Selects a custom build machine for this deployment without changing project settings. */
        buildMachine?: "turbo"
        /** The slug or ID of a custom environment to deploy to, overriding the default target environment. When omitted, the deployment targets the environment inferred from the branch (production or preview). */
        customEnvironmentSlugOrId?: string
        /** The ID of an existing deployment to redeploy. All project settings and environment variables are inherited from the original unless explicitly overridden in this request. The redeployment gets a new ID, URL, and build. */
        deploymentId?: string
        /** The files to include in the deployment. Each entry is either an inlined file (with `data` and `encoding`) or a reference to a previously uploaded file (with `sha` and `size`). Required for non-git deployments. Cannot be used together with `gitSource`. */
        files?: Array<{
          /** The file content, it could be either a `base64` (useful for images, etc.) of the files or the plain content for source code */
          data: string
          /** The file content encoding, it could be either a base64 (useful for images, etc.) of the files or the plain text for source code. */
          encoding?: "base64" | "utf-8"
          /** The file name including the whole path */
          file: string
        } | {
          /** The file path relative to the project root */
          file: string
          /** The file contents hashed with SHA1, used to check the integrity */
          sha?: string
          /** The file size in bytes */
          size?: number
        }>
        /** Populates initial git metadata for different git providers. */
        gitMetadata?: {
          /** The git repository's remote origin url */
          remoteUrl?: string
          /** The name of the author of the commit */
          commitAuthorName?: string
          /** The email of the author of the commit */
          commitAuthorEmail?: string
          /** The commit message */
          commitMessage?: string
          /** The branch on which the commit was made */
          commitRef?: string
          /** The hash of the commit */
          commitSha?: string
          /** Whether or not there have been modifications to the working tree since the latest commit */
          dirty?: boolean
          /** True if process.env.CI was set when deploying */
          ci?: boolean
          /** The type of CI system used */
          ciType?: string
          /** The username used for the Git Provider (e.g. GitHub) if their CI (e.g. GitHub Actions) was used, if available */
          ciGitProviderUsername?: string
          /** The visibility of the Git repository if their CI (e.g. GitHub Actions) was used, if available */
          ciGitRepoVisibility?: string
          /** Path of the deployed directory relative to the detected git repository root. Empty string when deploying from the repository root. */
          rootDirectory?: string
        }
        /** Defines the Git Repository source to be deployed. This property can not be used in combination with `files`. */
        gitSource?: {
          type: "vercel"
          /** The stable Vercel Git repository ID. */
          repoId: string
          sha: string
        } | {
          ref: string
          repoId: number | string
          sha?: string
          type: "github"
        } | {
          org: string
          ref: string
          repo: string
          sha?: string
          type: "github"
        } | {
          ref: string
          repoId: number | string
          sha?: string
          type: "github-limited"
        } | {
          org: string
          ref: string
          repo: string
          sha?: string
          type: "github-limited"
        } | {
          projectId: number | string
          ref: string
          sha?: string
          type: "gitlab"
        } | {
          ref: string
          repoUuid: string
          sha?: string
          type: "bitbucket"
          workspaceUuid?: string
        } | {
          owner: string
          ref: string
          sha?: string
          slug: string
          type: "bitbucket"
        } | {
          /** The Origin workspace slug. Optional because Vercel resolves it from the linked project. */
          owner?: string
          /** The branch or Git reference to deploy. */
          ref: string
          /** The Origin repository name. Optional because Vercel resolves it from the linked project. */
          repo?: string
          /** The stable Origin repository ID. Read it from the `link.repoId` field returned by the project API. */
          repoId: string
          /** The commit SHA to deploy. When omitted, Vercel resolves the latest commit on `ref`. */
          sha?: string
          type: "cursor-origin"
        }
        /** An object containing the deployment's metadata. Multiple key-value pairs can be attached to a deployment. For deployments created with a Cursor Origin `gitSource`, Vercel automatically adds `cursorOriginDeployment`, `cursorOriginCommitSha`, `cursorOriginCommitRef`, `cursorOriginCommitMessage`, `cursorOriginCommitAuthorName`, `cursorOriginCommitAuthorEmail` when available, `cursorOriginOwner`, `cursorOriginRepo`, `cursorOriginRepoId`, and `cursorOriginPrId` for pull request deployments. */
        meta?: {}
        monorepoManager?: string | null
        /** A string with the project name used in the deployment URL */
        name: string
        /** The target project identifier in which the deployment will be created. When defined, this parameter overrides name */
        project?: string
        /** Project settings that will be applied to the deployment. It is required for the first deployment of a project and will be saved for any following deployments */
        projectSettings?: {
          buildCommand?: string | null
          commandForIgnoringBuildStep?: string | null
          devCommand?: string | null
          framework?: null | "services" | "container" | "blitzjs" | "nextjs" | "gatsby" | "remix" | "react-router" | "astro" | "hexo" | "eleventy" | "docusaurus-2" | "docusaurus" | "preact" | "solidstart-1" | "solidstart" | "dojo" | "ember" | "vue" | "scully" | "ionic-angular" | "angular" | "polymer" | "svelte" | "sveltekit" | "sveltekit-1" | "ionic-react" | "create-react-app" | "gridsome" | "umijs" | "sapper" | "saber" | "stencil" | "nuxtjs" | "redwoodjs" | "hugo" | "jekyll" | "brunch" | "middleman" | "zola" | "hydrogen" | "vite" | "tanstack-start" | "tanstack-start-lovable" | "vitepress" | "vuepress" | "parcel" | "fastapi" | "flask" | "fasthtml" | "django" | "ash" | "factory-eve" | "eve" | "sanity" | "sanity-v2" | "storybook" | "nitro" | "hono" | "express" | "h3" | "koa" | "nestjs" | "elysia" | "fastify" | "xmcp" | "python" | "ruby" | "rust" | "axum" | "actix-web" | "bun" | "node" | "go" | "mastra" | null
          installCommand?: string | null
          /** Override the Node.js version that should be used for this deployment */
          nodeVersion?: "24.x" | "22.x" | "20.x" | "18.x" | "16.x" | "14.x" | "12.x" | "10.x" | "8.10.x"
          outputDirectory?: string | null
          rootDirectory?: string | null
          serverlessFunctionRegion?: string | null
          /** Opts-out of the message prompting a CLI user to connect a Git repository in `vercel link`. */
          skipGitConnectDuringLink?: boolean
          /** Indicates if there are source files outside of the root directory, typically used for monorepos */
          sourceFilesOutsideRootDirectory?: boolean
        }
        /** Either not defined, `staging`, `production`, or a custom environment identifier. If `staging`, a staging alias in the format `<project>-<team>.vercel.app` will be assigned. If `production`, any aliases defined in `alias` will be assigned. If omitted, the target will be `preview`. */
        target?: string
        /** When `true` and `deploymentId` is passed in, the sha from the previous deployment's `gitSource` is removed forcing the latest commit to be used. */
        withLatestCommit?: boolean
      }
    }
    /** Create a new Drain with the provided configuration. CLI fallback on MCP failure (partial): vercel api /v1/drains --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_drain: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        name: string
        projects: "some" | "all"
        projectIds?: string[]
        filter?: {
          version: string
          filter: {
            type: string
            project?: {
              ids?: string[]
            }
            log?: {
              sources?: Array<"build" | "edge" | "lambda" | "static" | "external" | "firewall" | "redirect">
            }
            deployment?: {
              environments?: Array<"production" | "preview">
            }
          } | {
            type: string
            text: string
          }
        }
        schemas: {
          log: {
            version: "v1"
          }
        } | {
          trace: {
            version: "v1"
          }
        } | {
          analytics: {
            version: "v1"
          }
        } | {
          speed_insights: {
            version: "v1"
          }
        }
        delivery?: {} & ({
          type: string
          endpoint: string
          compression?: "gzip" | "none"
          encoding: "json" | "ndjson"
          headers: {}
          secret?: string
        } | {
          type: string
          endpoint: {
            traces: string
          }
          encoding: "proto" | "json"
          headers: {}
          secret?: string
        } | {
          type: string
          endpoint: string
          encoding: "json" | "ndjson"
          compression: "none"
          fileStructure: "hive"
          roleArn: string
          region: string
          serverSideEncryption?: "AES256" | "aws:kms" | "aws:kms:dsse"
          objectAcl?: "private" | "bucket-owner-read" | "bucket-owner-full-control"
        })
        sampling?: Array<{
          type: string
          /** Sampling rate from 0 to 1 (e.g., 0.1 for 10%) */
          rate: number
          /** Environment to apply sampling to */
          env?: "production" | "preview"
          /** Request path prefix to apply the sampling rule to */
          requestPath?: string
        }>
        transforms?: {
          id: string
        }[]
        source?: {} & unknown
      }
    }
    /** Creates a Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_edge_config: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        slug: string
        items?: {}
      }
    }
    /** Adds a token to an existing Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/token --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_edge_config_token: {
      edgeConfigId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        label: string
      }
    }
    /** Create a new feature flag for a project. The flag must have a unique slug within the project and specify its kind (boolean, string, number, or json). CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags create {slug} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_flag: {
      /** The project id or name */
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** A unique (per project) key for the flag, composed of letters, numbers, dashes, and underscores */
        slug: string
        /** The kind of flag */
        kind: "boolean" | "string" | "number" | "json"
        /** The variants of the flag */
        variants?: Array<{
          /** The id of the variant */
          id: string
          /** A label for the variant */
          label?: string
          /** A description of the variant */
          description?: string
          value: string | number | boolean | {} | unknown[]
        }>
        environments: {}
        /** A random seed to prevent split points in different flags from having the same targets */
        seed?: number
        /** A description of the flag */
        description?: string
        state?: "active" | "archived"
        /** The user ids of the maintainers of the flag */
        maintainerIds?: string[]
        /** Whether this flag is marked as permanent, indicating it should not be removed */
        permanent?: boolean
        /** Tags for categorizing the flag */
        tags?: string[]
      }
    }
    /** Preferred when the intended source is pushed to an accessible remote repository's production branch. Create a Vercel project linked to that repository, or reuse the existing project already linked to it, to automatically deploy changes on every push. New projects use the team's default deployment protection. Creates a preview deployment from the production branch by default; do not ask for deployment confirmation. For local source, prefer the Vercel CLI. Use deploy_to_vercel only for small, simple inline deployments when neither the CLI nor a usable remote repository is available, or the user explicitly requests inline deployment. This prevents new bare projects; it does not reconnect an existing unlinked project with the same name. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__create_git_project: {
      /** Repository as "owner/name", or a repository URL such as https://github.com/owner/name or https://origin.cursor.com/owner/name. */
      repo: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool Required: the root MCP endpoint has no implicit team scope, so this prevents accidentally creating the project in the authenticated user's personal account. */
      teamId: string
      /** Git provider to link. Inferred from recognized repository URLs; otherwise defaults to "github". Use "cursor-origin" for Cursor-hosted repositories at origin.cursor.com. Ignored when the project already exists. */
      provider?: "github" | "gitlab" | "bitbucket" | "cursor-origin"
      /** Vercel project to create or reuse. Defaults to the lowercased repository name. */
      projectName?: string
      /** Root-relative directory to build in a monorepo. Only applied when creating the project. */
      rootDirectory?: string
      /** Whether to create a preview deployment from the linked repository's production branch. Defaults to true; set false only when the user explicitly requests link-only behavior. */
      deploy?: boolean
    }
    /** Create a KMS issuer with server-generated signing keys for the selected team. Configure its name, signing algorithm, claims schema, and initial policy. Private-key import is unavailable through MCP. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_kms_issuer: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The name of the issuer. */
        name: string
        /** The signing algorithm to use for the issuer. */
        algorithm?: "RS256" | "RS384" | "RS512" | "PS256" | "PS384" | "PS512" | "ES256" | "ES384" | "ES512"
        /** A JSON Schema used to validate the resolved token claims when signing tokens for this issuer. */
        claimsSchema?: {}
        policy?: {
          kind: "project-grant"
          /** The team ID for the project grant policy. */
          teamId: string
          /** The project ID for the project grant policy. */
          projectId: string
          /** The environments for the project grant policy. Each entry is a system environment (production, preview, development) or a custom environment ID (env_...). */
          environments: string[]
          /** The claims that KMS should include in signed JWTs for this policy. */
          tokenClaims?: {}
        } | {
          kind: "connex-grant"
          /** The Connex client ID for the Connex grant policy. */
          clientId: string
          /** The claims that KMS should include in signed JWTs for this policy. */
          tokenClaims?: {}
        }
      }
    }
    /** Attach a policy to a KMS issuer that grants a project's deployments permission to sign with it. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId}/policies --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_kms_issuer_policy: {
      /** The ID of the issuer. */
      issuerId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        kind: "project-grant"
        /** The project ID for the project grant policy. */
        projectId: string
        /** The environments for the project grant policy. Each entry is a system environment (production, preview, development) or a custom environment ID (env_...). */
        environments: string[]
        /** The claims that KMS should include in signed JWTs for this policy. */
        tokenClaims?: {}
      }
    }
    /** Generate a new signing key server-side for an existing KMS issuer ID. Configure automatic or manual activation and the previous-key grace period. Returns key metadata; private-key import is unavailable through MCP. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId}/keys --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_kms_signing_key: {
      /** The ID of the issuer. */
      issuerId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** Whether the new key is activated automatically after its public key has propagated, or manually via the activate endpoint. Defaults to `automatic`. */
        activation?: "automatic" | "manual"
        /** For automatic activation, how many hours after activation the previous signing key should stop being used. Defaults to a 1 hour grace period so already-issued tokens keep verifying. */
        revokePreviousAfterHours?: number
        /** Deprecated. The ISO date string or timestamp when the previous signing key should stop being used. Converted to a relative grace and applied at activation, not creation. Prefer revokePreviousAfterHours. */
        revokePreviousAt?: string | number
      }
    }
    /** Run a read-only Vercel observability query for a metric and owner or project scope. Supports time ranges, filters, grouping, aggregation, and result limits. Returns query results without changing project configuration. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} metrics {metric} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_observability_query: {
      /** Team ID to use for this operation. */
      teamId?: string
      requestBody: {
        /** Metric id */
        metric: string
        scope: {}
        /** Aggregation function to apply. Some aggregations require a dimension: use <agg>/<dimension>, for example unique/visitor_id. */
        aggregation?: string
        /** Dimensions to group results by. JSON dimensions support nested refs, for example event_data/checkout_step. Nested keys containing characters that OData cannot parse as an identifier, such as '-', spaces, quotes, or '/', must be wrapped in single quotes (escape embedded single quotes by doubling them), for example flags/'enable-comments-view' or event_data/'some property''s/value'. */
        groupBy?: string[]
        /** Filter to apply to the query. JSON dimensions support nested refs, for example event_data/checkout_step eq 'payment'. Nested keys containing characters that OData cannot parse as an identifier, such as '-', spaces, quotes, or '/', must be wrapped in single quotes (escape embedded single quotes by doubling them), for example flags/'enable-comments-view' eq true or event_data/'some property''s/value' eq true. */
        filter?: string
        /** Maximum number of results */
        limit?: number
        /** Rollup column to order grouped results by. Use the generated rollup key for the requested metric and aggregation. Defaults to the query engine count rollup. */
        orderBy?: string
        /** Direction to order grouped results by. Defaults to desc. */
        orderDirection?: "asc" | "desc"
        /** Time bucket size */
        granularity?: {}
        /** Start timestamp */
        startTime?: string
        /** End timestamp */
        endTime?: string
        /** IANA timezone (e.g. Europe/Paris) used only to align calendar buckets (1d/1mo) to that zone's day/month boundaries. startTime/endTime and all output timestamps are always UTC. No effect on sub-day granularities. */
        bucketTimezone?: string
      }
    }
    /** Perform one of two fixed domain operations selected by method: add (the default) adds an existing apex domain to the selected Vercel account; move-in accepts an approved move from another Vercel account. A move-in changes ownership within Vercel and requires a pending move approval for the receiving account. Neither method purchases a domain or transfers its registration from an external registrar. Domains acquired outside MCP can be added with method:add. CLI fallback on MCP failure (partial): vercel api /v7/domains --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_or_transfer_domain: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The domain operation to perform. */
        method?: "add" | "move-in"
        /** The domain name you want to add. */
        name: string
        /** Whether the domain has the Vercel CDN enabled or not. */
        cdnEnabled?: boolean
        /** Whether to create a DNS zone on Vercel. Set `true` if using Vercel nameservers. */
        zone?: boolean
        /** The move-in token from Move Requested email. */
        token?: string
      }
    }
    /** Allows to create a new project with the provided configuration. It only requires the project `name` but more configuration can be provided to override the defaults. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} project add {projectName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_project: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        enablePreviewFeedback?: boolean | null
        enableProductionFeedback?: boolean | null
        previewDeploymentsDisabled?: boolean | null
        previewDeploymentSuffix?: string | null
        buildCommand?: string | null
        commandForIgnoringBuildStep?: string | null
        devCommand?: string | null
        /** Collection of ENV Variables the Project will use */
        environmentVariables?: Array<{
          /** Name of the ENV variable */
          key: string
          /** Deployment Target or Targets in which the ENV variable will be used */
          target: "production" | "preview" | "development" | Array<"production" | "preview" | "development">
          /** If defined, the git branch of the environment variable (must have target=preview) */
          gitBranch?: string
          /** Type of the ENV variable */
          type?: "system" | "encrypted" | "plain" | "sensitive"
          /** Value for the ENV variable */
          value: string
        }>
        /** The framework that is being used for this project. When `null` is used no framework is selected */
        framework?: null | "container" | "blitzjs" | "nextjs" | "gatsby" | "remix" | "react-router" | "astro" | "hexo" | "eleventy" | "docusaurus-2" | "docusaurus" | "preact" | "solidstart-1" | "solidstart" | "dojo" | "ember" | "vue" | "scully" | "ionic-angular" | "angular" | "polymer" | "svelte" | "sveltekit" | "sveltekit-1" | "ionic-react" | "create-react-app" | "gridsome" | "umijs" | "sapper" | "saber" | "stencil" | "nuxtjs" | "redwoodjs" | "hugo" | "jekyll" | "brunch" | "middleman" | "zola" | "hydrogen" | "vite" | "tanstack-start" | "tanstack-start-lovable" | "vitepress" | "vuepress" | "parcel" | "fastapi" | "flask" | "fasthtml" | "django" | "ash" | "factory-eve" | "eve" | "sanity" | "sanity-v2" | "storybook" | "nitro" | "hono" | "express" | "h3" | "koa" | "nestjs" | "elysia" | "fastify" | "xmcp" | "python" | "ruby" | "rust" | "axum" | "actix-web" | "bun" | "node" | "go" | "services" | "mastra"
        /** The Git Repository that will be connected to the project. When this is defined, any pushes to the specified connected Git Repository will be automatically deployed */
        gitRepository?: {
          /** The name of the git repository. For example: \"vercel/next.js\" */
          repo: string
          /** The Git Provider of the repository */
          type: "github" | "github-limited" | "gitlab" | "bitbucket" | "vercel" | "cursor-origin"
        }
        installCommand?: string | null
        /** The desired name for the project */
        name: string
        /** Opts-out of the message prompting a CLI user to connect a Git repository in `vercel link`. */
        skipGitConnectDuringLink?: boolean
        ssoProtection?: {
          deploymentType: "all" | "preview" | "prod_deployment_urls_and_all_previews" | "all_except_custom_domains"
        } | null
        /** Specifies the default region and failover regions for sandboxes created in the project */
        sandbox?: {
          /** The Vercel region sandboxes in this project are created in by default. */
          region?: "iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1"
          /** The regions sandboxes in this project fall back to when they cannot be created in `region`. */
          failoverRegions?: Array<"iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1">
        }
        outputDirectory?: string | null
        publicSource?: boolean | null
        rootDirectory?: string | null
        serverlessFunctionRegion?: string | null
        /** Specifies whether Zero Config Failover is enabled for this project. */
        serverlessFunctionZeroConfigFailover?: boolean
        /** OpenID Connect JSON Web Token generation configuration. */
        oidcTokenConfig?: {
          /** Whether or not to generate OpenID Connect JSON Web Tokens. */
          enabled?: boolean
          /** team: `https://oidc.vercel.com/[team_slug]` global: `https://oidc.vercel.com` */
          issuerMode?: "team" | "global"
        }
        /** Opt-in to skip deployments when there are no changes to the root directory and its dependencies */
        enableAffectedProjectsDeployments?: boolean
        /** Specifies resource override configuration for the project */
        resourceConfig?: {
          buildMachineType?: "basic" | "enhanced" | "turbo" | "standard" | "elastic"
          fluid?: boolean
          /** The regions to deploy Vercel Functions to for this project */
          functionDefaultRegions?: string[]
          functionDefaultTimeout?: number
          functionDefaultMemoryType?: "standard_legacy" | "standard" | "performance" | "performance_xl"
          /** Specifies whether Zero Config Failover is enabled for this project. */
          functionZeroConfigFailover?: boolean
          elasticConcurrencyEnabled?: boolean
          buildMachineSelection?: "elastic" | "fixed"
          buildMachineElasticLastUpdated?: number
          buildMachineElasticReason?: "oom-failure" | "enospc-failure" | "build-timeout-failure" | "basic-floor" | "high-peak-memory" | "sustained-high-cpu" | "high-peak-disk" | "long-build-duration" | "short-build-duration" | "enterprise-floor"
          buildMachineElasticTransition?: {
            at: number
            direction: "upgrade" | "downgrade"
            algorithmVersion: string
          }
          isNSNBDisabled?: boolean
          buildQueue?: {
            configuration?: "SKIP_NAMESPACE_QUEUE" | "WAIT_FOR_NAMESPACE_QUEUE"
          }
          enableFunctionsBeta?: boolean
        }
      }
    }
    /** Create one or more environment variables for a project by passing its `key`, `value`, `type` and `target` and by specifying the project by either passing the project `id` or `name` in the URL. If you include `upsert=true` as a query parameter, a new environment variable will not be created if it already exists but, the existing variable's value will be updated. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} env add {name} {environment} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_project_env: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Allow override of environment variable if it already exists */
      upsert?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The name of the environment variable */
        key: string
        /** The value of the environment variable */
        value: string
        /** The type of environment variable */
        type: "system" | "encrypted" | "plain" | "sensitive"
        /** The target environment of the environment variable */
        target: Array<"production" | "preview" | "development">
        gitBranch?: string | null
        /** A comment to add context on what this environment variable is for */
        comment?: string
        /** The custom environment IDs associated with the environment variable */
        customEnvironmentIds?: string[]
      } | {
        /** The name of the environment variable */
        key: string
        /** The value of the environment variable */
        value: string
        /** The type of environment variable */
        type: "system" | "encrypted" | "plain" | "sensitive"
        /** The target environment of the environment variable */
        target?: Array<"production" | "preview" | "development">
        gitBranch?: string | null
        /** A comment to add context on what this environment variable is for */
        comment?: string
        /** The custom environment IDs associated with the environment variable */
        customEnvironmentIds: string[]
      } | Array<{
        /** The name of the environment variable */
        key: string
        /** The value of the environment variable */
        value: string
        /** The type of environment variable */
        type: "system" | "encrypted" | "plain" | "sensitive"
        /** The target environment of the environment variable */
        target: Array<"production" | "preview" | "development">
        gitBranch?: string | null
        /** A comment to add context on what this environment variable is for */
        comment?: string
        /** The custom environment IDs associated with the environment variable */
        customEnvironmentIds?: string[]
      } | {
        /** The name of the environment variable */
        key: string
        /** The value of the environment variable */
        value: string
        /** The type of environment variable */
        type: "system" | "encrypted" | "plain" | "sensitive"
        /** The target environment of the environment variable */
        target?: Array<"production" | "preview" | "development">
        gitBranch?: string | null
        /** A comment to add context on what this environment variable is for */
        comment?: string
        /** The custom environment IDs associated with the environment variable */
        customEnvironmentIds: string[]
      }>
    }
    /** Creates a DNS record for a domain. CLI fallback on MCP failure (partial): vercel api /v2/domains/{domain}/records --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_record: {
      /** The domain used to create the DNS record. */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** Must be of type `A`. */
        type: "A"
        /** A subdomain name or an empty string for the root domain. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** The record value must be a valid IPv4 address. */
        value: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `AAAA`. */
        type: "AAAA"
        /** A subdomain name or an empty string for the root domain. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** An AAAA record pointing to an IPv6 address. */
        value: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `ALIAS`. */
        type: "ALIAS"
        /** A subdomain name or an empty string for the root domain. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** An ALIAS virtual record pointing to a hostname resolved to an A record on server side. */
        value: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `CAA`. */
        type: "CAA"
        /** A subdomain name or an empty string for the root domain. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** A CAA record to specify which Certificate Authorities (CAs) are allowed to issue certificates for the domain. */
        value: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `CNAME`. */
        type: "CNAME"
        /** A subdomain name or an empty string for the root domain. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** A CNAME record mapping to another domain name. */
        value?: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `MX`. */
        type: "MX"
        /** A subdomain name or an empty string for the root domain. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** An MX record specifying the mail server responsible for accepting messages on behalf of the domain name. */
        value: string
        mxPriority: number
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `SRV`. */
        type: "SRV"
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        srv: {
          priority: number | null
          weight: number | null
          port: number | null
          target: string
        }
        /** A comment to add context on what this DNS record is for */
        comment?: string
        name: unknown
      } | {
        /** Must be of type `TXT`. */
        type: "TXT"
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** A TXT record containing arbitrary text. */
        value: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
        name: unknown
      } | {
        /** Must be of type `NS`. */
        type: "NS"
        /** A subdomain name. */
        name: string
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        /** An NS domain value. */
        value?: string
        /** A comment to add context on what this DNS record is for */
        comment?: string
      } | {
        /** Must be of type `HTTPS`. */
        type: "HTTPS"
        /** The TTL value. Must be a number between 60 and 2147483647. Default value is 60. */
        ttl?: number
        https: {
          priority: number | null
          target: string
          params?: string
        }
        /** A comment to add context on what this DNS record is for */
        comment?: string
        name: unknown
      }
    }
    /** Creates a point-in-time snapshot of a running session's filesystem. Snapshots can be used to quickly restore a session to a previous state or to create new sessions with pre-configured environments. The session must be running and able to accept commands for a snapshot to be created. The session will be terminated after the snapshot is created. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/snapshot --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_sandboxes_sessions_by_session_id_snapshot_v2: {
      /** The unique identifier of the session to snapshot. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The number of milliseconds after which the snapshot will expire and be deleted. Use 0 for no expiration. */
        expiration?: unknown | number
      }
    }
    /** Creates a point-in-time snapshot of a running session's filesystem. Snapshots can be used to quickly restore a session to a previous state or to create new sessions with pre-configured environments. The session must be running and able to accept commands for a snapshot to be created. The session will be terminated after the snapshot is created. Unlike v2, snapshots expire after 7 days when neither the request nor the sandbox configuration specifies an expiration. CLI fallback on MCP failure (partial): vercel api /v3/sandboxes/sessions/{sessionId}/snapshot --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_sandboxes_sessions_by_session_id_snapshot_v3: {
      /** The unique identifier of the session to snapshot. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The number of milliseconds after which the snapshot will expire and be deleted. Defaults to 7 days when neither this field nor the sandbox configuration specifies an expiration. Use 0 for no expiration. */
        expiration?: unknown | number
      }
    }
    /** Creates a named sandbox environment. Named sandboxes have a unique name within a project and support automatic snapshotting on shutdown. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} sandbox create --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_sandboxes_v2: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        networkPolicy?: {
          /** The network access policy mode. Use \"allow-all\" to permit all outbound traffic. Use \"deny-all\" to block all outbound traffic. Use \"custom\" to specify explicit allow/deny rules. */
          mode: "allow-all" | "deny-all" | "custom" | "default-allow" | "default-deny"
          /** List of domain names the sandbox is allowed to connect to. Only applies when mode is \"custom\". Supports wildcard patterns (e.g., \"*.example.com\" matches all subdomains). */
          allowedDomains?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is allowed to connect to. Traffic to these addresses bypasses domain-based restrictions. */
          allowedCIDRs?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is blocked from connecting to. These rules take precedence over all allowed rules. */
          deniedCIDRs?: string[]
          /** HTTP header injection rules for outgoing requests matching specific domains. Traffic to matching domains will be intercepted instead of proxied through encrypted connections. */
          injectionRules?: Array<{
            /** The domain (or pattern) of requests to add headers for. Supports wildcards like *.example.com. */
            domain: string
            /** HTTP headers to inject into requests for this domain. Existing headers with the same name will be overridden. */
            headers: {}
            /** Optional L7 match. When provided, the injection rule only applies to requests that satisfy every specified dimension. When multiple injection rules target the same domain they are evaluated in order and the first match wins; a rule without `match` matches any request and shadows later rules for the same domain. */
            match?: {
              /** Match on the request path. Comparison is case-sensitive. */
              path?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
              /** HTTP methods to match. Any single match succeeds (OR semantics). */
              method?: string[]
              /** Query-string entry matchers. Multiple entries are ANDed. Query parameter names and values are both compared case-sensitively (RFC 3986). When a request has multiple values for the same key, any matching value satisfies the matcher. */
              queryString?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
              /** Header matchers. Multiple entries are ANDed. Header names are compared case-insensitively (RFC 9110); header values are compared case-sensitively. When a request has multiple values for the same header, any matching value satisfies the matcher. */
              headers?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
            }
          }>
        } | {
          allow?: string[] | {}
          subnets?: {
            allow?: string[]
            deny?: string[]
          }
        }
        /** The runtime environment for the sandbox. Determines the pre-installed language runtimes and tools available. */
        runtime?: "node22" | "node24" | "node26" | "python3.13"
        /** CPU architecture. Inherits a snapshot or single image manifest when omitted. Image indexes default to amd64. Must match the source. ARM64 creation requires API v3 or v4 without runtime and team access. */
        architecture?: "amd64" | "arm64"
        /** Resources to define the VM */
        resources?: {
          /** The number of virtual CPUs to allocate to the sandbox. Must be 1, or an even number. */
          vcpus?: number
          /** The amount of memory in megabytes to allocate to the sandbox. Must equal vcpus * 2048. */
          memory?: number
        }
        /** The source from which to initialize the sandbox filesystem. Can be a Git repository, a tarball URL, or an existing snapshot. */
        source?: {
          type: "git"
          /** Public source URL without embedded credentials, query strings, or fragments. Use an existing snapshotId for private source prepared outside MCP. */
          url: string
          /** Create a shallow clone with history truncated to the specified number of commits. Useful for faster cloning of large repositories. */
          depth?: number
          /** The specific commit SHA, branch name, or tag to checkout after cloning. */
          revision?: string
        } | {
          type: "tarball"
          /** Public source URL without embedded credentials, query strings, or fragments. Use an existing snapshotId for private source prepared outside MCP. */
          url: string
        } | {
          type: "snapshot"
          /** The unique identifier of the snapshot to restore. */
          snapshotId: string
        }
        /** The target project slug or ID in which the sandbox will be assigned to. */
        projectId: string
        /** List of ports to expose from the sandbox. Each port will be accessible via a unique URL. Maximum of 15 ports can be exposed. */
        ports?: number[]
        /** Image to use for the sandbox. */
        image?: string
        /** Maximum duration in milliseconds that the sandbox can run before being automatically stopped. */
        timeout?: number
        /** Default environment variables for the sandbox. These are inherited by all commands unless overridden. */
        env?: {}
        /** List of drives to mount to the sandbox at the provided path. */
        mounts?: {}
        /** The Vercel region in which to create the sandbox. */
        region: "iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1"
        /** The regions the sandbox falls back to when it cannot be created in `region`. */
        failoverRegions?: Array<"iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1">
        /** The Connect network id for the target Secure Compute private network. */
        networkId?: string
        /** Name for the sandbox. Must be unique per project and URL-safe (alphanumeric, hyphens, underscores). */
        name?: string
        /** Whether the sandbox persists its state across restarts via automatic snapshots. Defaults to true. */
        persistent?: boolean
        /** Default snapshot expiration time in milliseconds. Set to 0 to disable expiration. When set, this value is used as the default expiration for all snapshots created for this sandbox. */
        snapshotExpiration?: unknown | number
        /** Protect the N most recent snapshots with different expiration/deletion behavior. */
        keepLastSnapshots?: {
          /** Number of most recent snapshots to keep. */
          count: number
          /** Expiration time in milliseconds for kept snapshots. Falls back to snapshotExpiration. */
          expiration?: unknown | number
          /** Whether to immediately delete evicted snapshots. Defaults to true. */
          deleteEvicted?: boolean
        }
        /** Key-value tags to associate with the sandbox. Maximum 5 tags. */
        tags?: {}
      }
    }
    /** Creates a named sandbox environment. Named sandboxes have a unique name within a project and support automatic snapshotting on shutdown. Unlike v2, this version has no `runtime` parameter: when no `image` is provided (and the sandbox is not restored from a snapshot), the sandbox is created from the default universal image. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} sandbox create --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_sandboxes_v3: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        networkPolicy?: {
          /** The network access policy mode. Use \"allow-all\" to permit all outbound traffic. Use \"deny-all\" to block all outbound traffic. Use \"custom\" to specify explicit allow/deny rules. */
          mode: "allow-all" | "deny-all" | "custom" | "default-allow" | "default-deny"
          /** List of domain names the sandbox is allowed to connect to. Only applies when mode is \"custom\". Supports wildcard patterns (e.g., \"*.example.com\" matches all subdomains). */
          allowedDomains?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is allowed to connect to. Traffic to these addresses bypasses domain-based restrictions. */
          allowedCIDRs?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is blocked from connecting to. These rules take precedence over all allowed rules. */
          deniedCIDRs?: string[]
          /** HTTP header injection rules for outgoing requests matching specific domains. Traffic to matching domains will be intercepted instead of proxied through encrypted connections. */
          injectionRules?: Array<{
            /** The domain (or pattern) of requests to add headers for. Supports wildcards like *.example.com. */
            domain: string
            /** HTTP headers to inject into requests for this domain. Existing headers with the same name will be overridden. */
            headers: {}
            /** Optional L7 match. When provided, the injection rule only applies to requests that satisfy every specified dimension. When multiple injection rules target the same domain they are evaluated in order and the first match wins; a rule without `match` matches any request and shadows later rules for the same domain. */
            match?: {
              /** Match on the request path. Comparison is case-sensitive. */
              path?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
              /** HTTP methods to match. Any single match succeeds (OR semantics). */
              method?: string[]
              /** Query-string entry matchers. Multiple entries are ANDed. Query parameter names and values are both compared case-sensitively (RFC 3986). When a request has multiple values for the same key, any matching value satisfies the matcher. */
              queryString?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
              /** Header matchers. Multiple entries are ANDed. Header names are compared case-insensitively (RFC 9110); header values are compared case-sensitively. When a request has multiple values for the same header, any matching value satisfies the matcher. */
              headers?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
            }
          }>
        } | {
          allow?: string[] | {}
          subnets?: {
            allow?: string[]
            deny?: string[]
          }
        }
        /** CPU architecture. Inherits a snapshot or single image manifest when omitted. Image indexes default to amd64. Must match the source. ARM64 creation requires API v3 or v4 without runtime and team access. */
        architecture?: "amd64" | "arm64"
        /** Resources to define the VM */
        resources?: {
          /** The number of virtual CPUs to allocate to the sandbox. Must be 1, or an even number. */
          vcpus?: number
          /** The amount of memory in megabytes to allocate to the sandbox. Must equal vcpus * 2048. */
          memory?: number
        }
        /** The source from which to initialize the sandbox filesystem. Can be a Git repository, a tarball URL, or an existing snapshot. */
        source?: {
          type: "git"
          /** Public source URL without embedded credentials, query strings, or fragments. Use an existing snapshotId for private source prepared outside MCP. */
          url: string
          /** Create a shallow clone with history truncated to the specified number of commits. Useful for faster cloning of large repositories. */
          depth?: number
          /** The specific commit SHA, branch name, or tag to checkout after cloning. */
          revision?: string
        } | {
          type: "tarball"
          /** Public source URL without embedded credentials, query strings, or fragments. Use an existing snapshotId for private source prepared outside MCP. */
          url: string
        } | {
          type: "snapshot"
          /** The unique identifier of the snapshot to restore. */
          snapshotId: string
        }
        /** The target project slug or ID in which the sandbox will be assigned to. */
        projectId?: string
        /** List of ports to expose from the sandbox. Each port will be accessible via a unique URL. Maximum of 15 ports can be exposed. */
        ports?: number[]
        /** Image to use for the sandbox. */
        image?: string
        /** Maximum duration in milliseconds that the sandbox can run before being automatically stopped. */
        timeout?: number
        /** Default environment variables for the sandbox. These are inherited by all commands unless overridden. */
        env?: {}
        /** List of drives to mount to the sandbox at the provided path. */
        mounts?: {}
        /** The Vercel region in which to create the sandbox. */
        region?: "iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1"
        /** The regions the sandbox falls back to when it cannot be created in `region`. */
        failoverRegions?: Array<"iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1">
        /** The Connect network id for the target Secure Compute private network. */
        networkId?: string
        /** Name for the sandbox. Must be unique per project and URL-safe (alphanumeric, hyphens, underscores). */
        name?: string
        /** Whether the sandbox persists its state across restarts via automatic snapshots. Defaults to true. */
        persistent?: boolean
        /** Default snapshot expiration time in milliseconds. Set to 0 to disable expiration. When set, this value is used as the default expiration for all snapshots created for this sandbox. */
        snapshotExpiration?: unknown | number
        /** Protect the N most recent snapshots with different expiration/deletion behavior. */
        keepLastSnapshots?: {
          /** Number of most recent snapshots to keep. */
          count: number
          /** Expiration time in milliseconds for kept snapshots. Falls back to snapshotExpiration. */
          expiration?: unknown | number
          /** Whether to immediately delete evicted snapshots. Defaults to true. */
          deleteEvicted?: boolean
        }
        /** Key-value tags to associate with the sandbox. Maximum 5 tags. */
        tags?: {}
      }
    }
    /** Creates a named sandbox environment. Named sandboxes have a unique name within a project and support automatic snapshotting on shutdown. When no `image` is provided (and the sandbox is not restored from a snapshot), the sandbox is created from the default universal image. Unlike v3, snapshots expire after 7 days by default and persistent sandboxes keep only their most recent snapshot unless `keepLastSnapshots` is configured otherwise (or set to `null` to disable the limit). CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} sandbox create --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_sandboxes_v4: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        networkPolicy?: {
          /** The network access policy mode. Use \"allow-all\" to permit all outbound traffic. Use \"deny-all\" to block all outbound traffic. Use \"custom\" to specify explicit allow/deny rules. */
          mode: "allow-all" | "deny-all" | "custom" | "default-allow" | "default-deny"
          /** List of domain names the sandbox is allowed to connect to. Only applies when mode is \"custom\". Supports wildcard patterns (e.g., \"*.example.com\" matches all subdomains). */
          allowedDomains?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is allowed to connect to. Traffic to these addresses bypasses domain-based restrictions. */
          allowedCIDRs?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is blocked from connecting to. These rules take precedence over all allowed rules. */
          deniedCIDRs?: string[]
          /** HTTP header injection rules for outgoing requests matching specific domains. Traffic to matching domains will be intercepted instead of proxied through encrypted connections. */
          injectionRules?: Array<{
            /** The domain (or pattern) of requests to add headers for. Supports wildcards like *.example.com. */
            domain: string
            /** HTTP headers to inject into requests for this domain. Existing headers with the same name will be overridden. */
            headers: {}
            /** Optional L7 match. When provided, the injection rule only applies to requests that satisfy every specified dimension. When multiple injection rules target the same domain they are evaluated in order and the first match wins; a rule without `match` matches any request and shadows later rules for the same domain. */
            match?: {
              /** Match on the request path. Comparison is case-sensitive. */
              path?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
              /** HTTP methods to match. Any single match succeeds (OR semantics). */
              method?: string[]
              /** Query-string entry matchers. Multiple entries are ANDed. Query parameter names and values are both compared case-sensitively (RFC 3986). When a request has multiple values for the same key, any matching value satisfies the matcher. */
              queryString?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
              /** Header matchers. Multiple entries are ANDed. Header names are compared case-insensitively (RFC 9110); header values are compared case-sensitively. When a request has multiple values for the same header, any matching value satisfies the matcher. */
              headers?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
            }
          }>
        } | {
          allow?: string[] | {}
          subnets?: {
            allow?: string[]
            deny?: string[]
          }
        }
        /** CPU architecture. Inherits a snapshot or single image manifest when omitted. Image indexes default to amd64. Must match the source. ARM64 creation requires API v3 or v4 without runtime and team access. */
        architecture?: "amd64" | "arm64"
        /** Resources to define the VM */
        resources?: {
          /** The number of virtual CPUs to allocate to the sandbox. Must be 1, or an even number. */
          vcpus?: number
          /** The amount of memory in megabytes to allocate to the sandbox. Must equal vcpus * 2048. */
          memory?: number
        }
        /** The source from which to initialize the sandbox filesystem. Can be a Git repository, a tarball URL, or an existing snapshot. */
        source?: {
          type: "git"
          /** Public source URL without embedded credentials, query strings, or fragments. Use an existing snapshotId for private source prepared outside MCP. */
          url: string
          /** Create a shallow clone with history truncated to the specified number of commits. Useful for faster cloning of large repositories. */
          depth?: number
          /** The specific commit SHA, branch name, or tag to checkout after cloning. */
          revision?: string
        } | {
          type: "tarball"
          /** Public source URL without embedded credentials, query strings, or fragments. Use an existing snapshotId for private source prepared outside MCP. */
          url: string
        } | {
          type: "snapshot"
          /** The unique identifier of the snapshot to restore. */
          snapshotId: string
        }
        /** The target project slug or ID in which the sandbox will be assigned to. */
        projectId?: string
        /** List of ports to expose from the sandbox. Each port will be accessible via a unique URL. Maximum of 15 ports can be exposed. */
        ports?: number[]
        /** Image to use for the sandbox. */
        image?: string
        /** Maximum duration in milliseconds that the sandbox can run before being automatically stopped. */
        timeout?: number
        /** Default environment variables for the sandbox. These are inherited by all commands unless overridden. */
        env?: {}
        /** List of drives to mount to the sandbox at the provided path. */
        mounts?: {}
        /** The Vercel region in which to create the sandbox. */
        region?: "iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1"
        /** The regions the sandbox falls back to when it cannot be created in `region`. */
        failoverRegions?: Array<"iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1">
        /** The Connect network id for the target Secure Compute private network. */
        networkId?: string
        /** Name for the sandbox. Must be unique per project and URL-safe (alphanumeric, hyphens, underscores). */
        name?: string
        /** Whether the sandbox persists its state across restarts via automatic snapshots. Defaults to true. */
        persistent?: boolean
        /** Default snapshot expiration time in milliseconds. Defaults to 7 days. Set to 0 to disable expiration. When set, this value is used as the default expiration for all snapshots created for this sandbox. */
        snapshotExpiration?: unknown | number
        /** Protect the N most recent snapshots with different expiration/deletion behavior. Persistent sandboxes default to keeping only the last snapshot (evicted snapshots are deleted). Set to null to disable the limit. */
        keepLastSnapshots?: string | {
          /** Number of most recent snapshots to keep. */
          count: number
          /** Expiration time in milliseconds for kept snapshots. Falls back to snapshotExpiration. */
          expiration?: unknown | number
          /** Whether to immediately delete evicted snapshots. Defaults to true. */
          deleteEvicted?: boolean
        }
        /** Key-value tags to associate with the sandbox. Maximum 5 tags. */
        tags?: {}
      }
    }
    /** Creates an SDK key. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags sdk-keys add --type {type} --environment {environment} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_sdk_key: {
      /** The project id or name */
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        sdkKeyType: "server" | "mobile" | "client"
        environment: string
        label?: string
      }
    }
    /** Creates a new directory in a session's filesystem. By default, parent directories are created recursively if they don't exist (similar to `mkdir -p`). CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/fs/mkdir --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_session_directory: {
      /** The unique identifier of the session to create the directory in. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The base directory for resolving relative paths. If not specified, paths are resolved from the sandbox home directory. */
        cwd?: string
        /** The path of the directory to create. Can be absolute or relative to the working directory. */
        path: string
        /** If true, creates parent directories as needed (like `mkdir -p`). If false, fails if parent directories do not exist. */
        recursive?: boolean
      }
    }
    /** Create a Blob store CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} storage create {name} --type blob --access {access}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_storage_stores_blob: {
      /** Team ID to use for this operation. */
      teamId?: string
      requestBody?: {
        name: string
        region?: "arn1" | "bom1" | "cdg1" | "cle1" | "cpt1" | "dub1" | "dxb1" | "fra1" | "gru1" | "hkg1" | "hnd1" | "iad1" | "icn1" | "kix1" | "lhr1" | "pdx1" | "sfo1" | "sin1" | "syd1" | "yul1"
        access?: "public" | "private"
        projectId?: string
      }
    }
    /** Mints a short-lived HS256 JWT scoped to a deployment hostname. The Vercel CLI presents this JWT to the Vercel proxy on requests it wants traced. CLI fallback on MCP failure (partial): vercel api /v1/projects/traces/session --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__create_trace_session: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The project ID the deployment belongs to. */
        projectId: string
        /** The deployment hostname to scope the trace session to. */
        hostname: string
      }
    }
    /** Edit a specific environment variable for a given project by passing the environment variable identifier and either passing the project `id` or `name` in the URL. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} env update {name} {environment} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__edit_project_env: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** The unique environment variable identifier */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The name of the environment variable */
        key?: string
        /** The target environment of the environment variable */
        target?: Array<"production" | "preview" | "development">
        gitBranch?: string | null
        /** The type of environment variable */
        type?: "system" | "encrypted" | "plain" | "sensitive"
        /** The value of the environment variable */
        value?: string
        /** The custom environments that the environment variable should be synced to */
        customEnvironmentIds?: string[]
        /** A comment to add context on what this env var is for */
        comment?: string
      }
    }
    /** Replace a routing rule identified by its ID, or restore it from the current production version. Stages a new version with the modified route. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes/{routeId} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__edit_route: {
      projectId: string
      routeId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The full route object to replace the existing route with */
        route: {
          name: string
          description?: string
          enabled?: boolean
          /** Pattern syntax type. If not provided, inferred from pattern. */
          srcSyntax?: "equals" | "path-to-regexp" | "regex"
          route: {
            src: string
            dest?: string
            headers?: {}
            caseSensitive?: boolean
            status?: number
            has?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            missing?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            transforms?: Array<{
              type?: "request.headers" | "request.query" | "response.headers"
              op?: "append" | "set" | "delete"
              target?: {}
              args?: unknown
              env?: string[]
            }>
            respectOriginCacheControl?: boolean
          }
        }
        /** If true, restores the staged route to the value in the production version. */
        restore?: boolean
      } | {
        /** The full route object to replace the existing route with */
        route?: {
          name: string
          description?: string
          enabled?: boolean
          /** Pattern syntax type. If not provided, inferred from pattern. */
          srcSyntax?: "equals" | "path-to-regexp" | "regex"
          route: {
            src: string
            dest?: string
            headers?: {}
            caseSensitive?: boolean
            status?: number
            has?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            missing?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            transforms?: Array<{
              type?: "request.headers" | "request.query" | "response.headers"
              op?: "append" | "set" | "delete"
              target?: {}
              args?: unknown
              env?: string[]
            }>
            respectOriginCacheControl?: boolean
          }
        }
        restore: true
      }
    }
    /** Overwrite the markdown content of an existing message in a toolbar thread. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} comments edit {threadId} {messageId} -m {message} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__edit_toolbar_message: {
      /** The thread ID containing the message */
      threadId: string
      /** The message ID to edit */
      messageId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The updated message content in markdown format */
      markdown: string
    }
    /** Extends the maximum execution time of a running session. The session must be active and able to accept commands. The total timeout cannot exceed the maximum allowed limit for your account. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/extend-timeout --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__extend_session_timeout: {
      /** The unique identifier of the session to extend the timeout for. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The amount of time in milliseconds to add to the current timeout. Must be at least 1000ms (1 second). */
        duration: number
      }
    }
    /** Retrieve the environment variables for a given project by passing either the project `id` or `name` in the URL. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} env list --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__filter_project_envs: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** If defined, the git branch of the environment variable to filter the results (must have target=preview) */
      gitBranch?: string
      /** If true, the environment variable value will be decrypted */
      decrypt?: "true" | "false"
      /** The source that is calling the endpoint. */
      source?: string
      /** The unique custom environment identifier within the project */
      customEnvironmentId?: string
      /** The custom environment slug (name) within the project */
      customEnvironmentSlug?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Generate a routing rule configuration from a natural language description. Returns a suggested route configuration that can be reviewed and saved. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes/generate --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__generate_route: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        prompt: string
        currentRoute?: {
          name?: string
          description?: string
          pathCondition: {
            value?: string
            syntax?: string
          }
          conditions?: {
            field?: string
            operator?: string
            key?: string
            value?: string
            missing?: boolean
          }[]
          actions: {
            type?: string
            subType?: string
            dest?: string
            status?: number
            headers?: {
              key?: string
              value?: string
              op?: string
            }[]
          }[]
        }
      }
    }
    /** Creates or reuses a shareable link that bypasses authentication for protected Vercel deployments. When you encounter a Vercel deployment URL (like https://myapp-abc123.vercel.app), you might receive a 403 (Forbidden) error when trying to access it. This tool generates a special URL with a '_vercel_share' parameter that allows temporary access without requiring login credentials. New links expire in 23 hours. Existing valid links keep their expiration and may not expire. When you use the returned URL, that URL will redirect and set an auth cookie. If your fetch implementation does not support cookies, use the 'web_fetch_vercel_url' tool instead. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__get_access_to_vercel_url: {
      /** The team ID or slug that owns the deployment. Provide this for team deployments so the lookup uses the correct scope. Use list_teams if unknown. */
      teamId?: string
      /** The full URL of the Vercel deployment (e.g. "https://myapp.vercel.app"). */
      url: string
    }
    /** Retrieve active attack data within the last N days (default: 1 day) CLI fallback on MCP failure (partial): vercel api /v1/security/firewall/attack-status --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_active_attack_status: {
      projectId: string
      since?: number
      /** Team ID to use for this operation. */
      teamId: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get detailed metadata for a single Agent Run from an eve agent, including events, workflow metadata, usage, and subagent breakout data. Use list_agent_runs first if you need to discover a run ID. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} agent-runs inspect {runId} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_agent_run: {
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The project ID to get the deployment events for. Alternatively the project slug can be used. Project IDs start with "prj_". If you do not know the project ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the projectId - Use the `list_projects` tool */
      projectId: string
      /** The Agent Run ID to inspect. */
      runId: string
      /** Agent run environment, usually "production" or "preview". Defaults to "production". */
      environment?: string
      /** Preset time range. Ignored when both from and to are provided. Defaults to the dashboard endpoint default. */
      period?: "5m" | "15m" | "1h" | "6h" | "12h" | "1d" | "3d" | "7d" | "14d" | "30d" | "90d"
      /** Start time as ISO 8601, Unix seconds, Unix milliseconds, or a relative duration like "12h". Must be used with to. */
      from?: string
      /** End time as ISO 8601, Unix seconds, Unix milliseconds, a relative duration like "1h", or "now". Must be used with from. */
      to?: string
    }
    /** Get one page of the trace for a single Agent Run from an eve agent, including turns, messages, reasoning, tool calls, token usage, and tool input/output when available. To read all available turns, follow the trace payload’s later cursor until absent; use earlier to read backwards. Pages can overlap: deduplicate turns by ID, keeping the more complete turn. Use maxFieldLength: 0 to preserve full string content. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} agent-runs trace {runId} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_agent_run_trace: {
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The project ID to get the deployment events for. Alternatively the project slug can be used. Project IDs start with "prj_". If you do not know the project ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the projectId - Use the `list_projects` tool */
      projectId: string
      /** The Agent Run ID to inspect. */
      runId: string
      /** Agent run environment, usually "production" or "preview". Defaults to "production". */
      environment?: string
      /** Preset time range. Ignored when both from and to are provided. Defaults to the dashboard endpoint default. */
      period?: "5m" | "15m" | "1h" | "6h" | "12h" | "1d" | "3d" | "7d" | "14d" | "30d" | "90d"
      /** Start time as ISO 8601, Unix seconds, Unix milliseconds, or a relative duration like "12h". Must be used with to. */
      from?: string
      /** End time as ISO 8601, Unix seconds, Unix milliseconds, a relative duration like "1h", or "now". Must be used with from. */
      to?: string
      /** Maximum length for individual string fields in the returned trace. Defaults to 8000; use 0 to disable truncation. */
      maxFieldLength?: number
      /** Copy streamId from the trace payload’s later or earlier object. Requires exactly one pagination cursor. */
      traceStreamId?: string
      /** Copy cursor from later to fetch the next page, with its traceStreamId. */
      traceAfterCursor?: string
      /** Copy beforeChunk from earlier to fetch the previous page, with its traceStreamId. */
      traceBeforeChunk?: number
    }
    /** Retrieves an Alias for the given host name or alias ID. CLI fallback on MCP failure (partial): vercel api /v4/aliases/{idOrAlias} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_alias: {
      /** Get the alias only if it was created after the provided timestamp */
      from?: number
      /** The alias or alias ID to be retrieved */
      idOrAlias: string
      /** Get the alias only if it is assigned to the provided project ID */
      projectId?: string
      /** Get the alias only if it was created after this JavaScript timestamp */
      since?: number
      /** Get the alias only if it was created before this JavaScript timestamp */
      until?: number
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves information related to the currently authenticated User. CLI fallback on MCP failure (partial): vercel api /v2/user --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_auth_user: {}
    /** Check registration availability for up to 50 domains. This is a read-only registry lookup despite using POST; it does not reserve, register, or purchase any domain. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} domains check {domain1} {domain2}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_bulk_availability: {
      /** Team ID to use for this operation. */
      teamId?: string
      requestBody: {
        /** an array of at most 50 item(s) */
        domains: string[]
      }
    }
    /** Get price data for multiple domains in a single request. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} domains price {domain1} {domain2}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_bulk_price: {
      /** Team ID to use for this operation. */
      teamId?: string
      requestBody: {
        /** an array of at most 50 item(s) */
        domains: string[]
        /** The number of years to get the price for. If not provided, the minimum number of years for the TLD will be used. */
        years?: number
      }
    }
    /** Retrieve the system bypass rules configured for the specified project CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} firewall system-bypass list --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_bypass_ip: {
      projectId: string
      limit?: number
      /** Filter by source IP */
      sourceIp?: string
      /** Filter by domain */
      domain?: string
      /** Filter by project scoped rules */
      projectScope?: boolean
      /** Used for pagination. Retrieves results after the provided id */
      offset?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get cert by id CLI fallback on MCP failure (partial): vercel api /v8/certs/{id} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_cert_by_id: {
      /** The cert id */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve an installed integration configuration by ID. The authenticated account or selected team must own the configuration. CLI fallback on MCP failure (partial): vercel api /v1/integrations/configuration/{id} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_configuration: {
      /** ID of the configuration to check */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the connector by ID. Accepts a dashboard/team requester or a deployment's project OIDC token. Project requesters may only read connectors linked to their project and environment. CLI fallback on MCP failure (partial): vercel api /v1/connect/connectors/{connector} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_connector: {
      /** Stable connector ID or URL-encoded team-scoped UID. Examples: `scl_abc123` or `slack%2Fmy-bot`. */
      connector: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the configuration that connects a connector to a project. CLI fallback on MCP failure (partial): vercel api /v1/connect/connectors/{connector}/projects/{projectId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_connector_project_connection: {
      /** Stable connector ID or URL-encoded team-scoped UID. Examples: `scl_abc123` or `slack%2Fmy-bot`. */
      connector: string
      /** Vercel project ID. */
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the contact-field schema required by a domain's TLD. Returns field requirements, not a registrant's personal information. Does not submit contact details or register a domain. CLI fallback on MCP failure (partial): vercel api /v1/registrar/domains/{domain}/contact-info/schema --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_contact_info_schema: {
      /** A valid domain name */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Retrieve a custom environment for the project. Must not be named 'Production' or 'Preview'. CLI fallback on MCP failure (partial): vercel api /v9/projects/{idOrName}/custom-environments/{environmentSlugOrId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_custom_environment: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** The unique custom environment identifier within the project */
      environmentSlugOrId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves information for a deployment either by supplying its ID (`id` property) or Hostname (`url` property). Additional details will be included when the authenticated user or team is an owner of the deployment. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} inspect {deploymentIdOrUrl}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_deployment: {
      /** The unique identifier or hostname of the deployment. */
      idOrUrl: string
      /** When `true`, the response includes the `gitSource` object with the commit SHA, branch name, and connected repository metadata. Defaults to `false`. */
      withGitRepoInfo?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the feature flags of a deployment. CLI fallback on MCP failure (partial): vercel api /v1/deployments/{deploymentId}/feature-flags --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_deployment_feature_flags: {
      deploymentId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Allows to retrieve the content of a file by supplying the file identifier and the deployment unique identifier. The response body will contain a JSON response containing the contents of the file encoded as base64. CLI fallback on MCP failure (partial): vercel api /v8/deployments/{id}/files/{fileId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_deployment_file_contents: {
      /** The unique deployment identifier */
      id: string
      /** The unique file identifier */
      fileId: string
      /** Path to the file to fetch (only for Git deployments) */
      path?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get information for a single domain in an account or team. CLI fallback on MCP failure (partial): vercel api /v5/domains/{domain} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain: {
      /** The name of the domain. */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Check whether a domain is available for registration. This is a read-only registry lookup; it does not reserve, register, or purchase the domain. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} domains check {domain}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain_availability: {
      /** A valid domain name */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get a Domain's configuration. CLI fallback on MCP failure (partial): vercel api /v6/domains/{domain}/config --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain_config: {
      /** The name of the domain. */
      domain: string
      /** The project id or name that will be associated with the domain. Use this when the domain is not yet associated with a project. */
      projectIdOrName?: string
      /** When true, the response will only include the nameservers assigned directly to the specified domain. When false and there are no nameservers assigned directly to the specified domain, the response will include the nameservers of the domain's parent zone. */
      strict?: "true" | "false"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the registrant contact verification status for a domain. Use this after purchasing a domain to determine whether the contact has been verified. Note that a bought_too_recently error will be returned if the domain was bought less than 30 minutes before the request. CLI fallback on MCP failure (partial): vercel api /v1/registrar/domains/{domain}/contact-verification --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain_contact_verification: {
      /** A valid domain name */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get the status of a domain purchase order returned by buy_domain, to confirm whether the registration completed. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__get_domain_order: {
      /** The orderId returned by buy_domain. */
      orderId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId?: string
    }
    /** Get price data for a specific domain CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} domains price {domain}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain_price: {
      /** A valid domain name */
      domain: string
      /** The number of years to get the price for. If not provided, the minimum number of years for the TLD will be used. */
      years?: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** List all project domains associated with an apex domain owned by the authenticated account. CLI fallback on MCP failure (partial): vercel api /v1/domains/{domain}/project-domains --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain_project_domains: {
      /** The apex domain name. */
      domain: string
      /** Maximum number of project domains to list from a request. */
      limit?: number
      /** Get project domains created after this JavaScript timestamp. */
      since?: number
      /** Get project domains created before this JavaScript timestamp. */
      until?: number
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the TXT verification record needed to claim ownership of a domain for the authenticated team. The caller must add this TXT record to `_vercel.{domain}` in their DNS configuration, then call POST /domains/:domain/claim to complete the ownership transfer. CLI fallback on MCP failure (partial): vercel api /v9/domains/{domain}/verification --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domain_verification_record: {
      /** The domain name to get the verification record for */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve a single DNS record by its record ID for the authenticated account or selected team. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} dns inspect {recordId}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_domains_records_by_record_id: {
      /** The unique ID of the DNS record */
      recordId: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get the information for a specific Drain by passing the drain id in the URL. CLI fallback on MCP failure (partial): vercel api /v1/drains/{id} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_drain: {
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns a Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config: {
      edgeConfigId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a specific version of a Global Config from backup storage. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/backups/{edgeConfigBackupVersionId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config_backup: {
      edgeConfigId: string
      edgeConfigBackupVersionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns backups of a Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/backups --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config_backups: {
      edgeConfigId: string
      next?: string
      limit?: number
      metadata?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns a specific Global Config Item. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/item/{edgeConfigItemKey} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config_item: {
      edgeConfigId: string
      edgeConfigItemKey: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns all items of a Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/items --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config_items: {
      edgeConfigId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Return meta data about a Global Config token. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/token/{token} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config_token: {
      edgeConfigId: string
      token: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns all tokens of a Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/tokens --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_config_tokens: {
      edgeConfigId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns all Global Configs. CLI fallback on MCP failure (partial): vercel api /v1/global-config --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_edge_configs: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the specified firewall configuration for a project. The deployed configVersion will be `active` CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} firewall status --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_firewall_config: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      configVersion: string
    }
    /** Retrieve a specific feature flag by its ID or slug. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags inspect {flagIdOrSlug} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_flag: {
      /** The project id or name */
      projectIdOrName: string
      /** The flag id or name */
      flagIdOrSlug: string
      /** Etag to match, can be used interchangeably with the `if-match` header */
      ifMatch?: string
      /** Whether to include metadata in the response */
      withMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve a feature flag segment by ID or slug. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectIdOrName}/feature-flags/segments/{segmentIdOrSlug} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_flag_segment: {
      /** The project id or name */
      projectIdOrName: string
      /** The segment slug */
      segmentIdOrSlug: string
      /** Whether to include metadata */
      withMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve feature flag settings for a project. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectIdOrName}/feature-flags/settings --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_flag_settings: {
      /** The project id or name */
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Lists the user's Vercel teams with each team's plan, connected Cursor Origin workspaces, and linked Git projects. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__get_git_deployment_context: {}
    /** Retrieve a single KMS issuer by its ID. Accepts either a team bearer token (existing path) or an OIDC token authorized by one of the issuer's policies (e.g. a connex-grant token). The OIDC path returns the issuer without policies, since a policy token only proves signing access, not management access. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_kms_issuer: {
      /** The ID of the issuer. */
      issuerId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the microfrontends config for a deployment. CLI fallback on MCP failure (partial): vercel api /v1/microfrontends/{deploymentId}/config --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_microfrontends_config: {
      /** The unique deployment identifier */
      deploymentId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the microfrontends config for a project by ID or name. CLI fallback on MCP failure (partial): vercel api /v1/microfrontends/projects/{projectIdOrName}/production-mfe-config --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_microfrontends_config_for_project: {
      /** The name or ID of the project */
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a named sandbox by name, including its current sandbox and routes. If the sandbox is stopped and resume is true, a new sandbox will be created from the most recent snapshot. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/{name} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_named_sandbox: {
      /** Name for the sandbox. Must be unique per project and URL-safe (alphanumeric, hyphens, underscores). */
      name: string
      /** The project ID or name (required when not using OIDC token). */
      projectId?: string
      /** Whether to automatically resume a stopped named sandbox by creating a new instance from its snapshot. Defaults to false. */
      resume?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Lists the projects that are currently configured as disabled for Observability Plus on a team. CLI fallback on MCP failure (partial): vercel api /v1/observability/manage/configuration/projects --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_observability_configuration_projects: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the available Vercel observability metrics and their query schemas. Use this to choose supported metrics and dimensions before running an observability query. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} metrics schema. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_observability_schema: {}
    /** Get information about a domain order by its ID CLI fallback on MCP failure (partial): vercel api /v1/registrar/orders/{orderId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_order: {
      /** A valid order ID */
      orderId: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get the information for a specific project by passing either the project `id` or `name` in the URL. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} project inspect {projectName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_project: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a link to the Delete Project section in the Vercel dashboard for the selected team and project. Verifies project ownership and returns requires_user_action; the user must review and confirm deletion in Vercel. This tool does not delete the project. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__get_project_deletion_link: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId: string
    }
    /** Get project domain by project id/name and domain name. CLI fallback on MCP failure (partial): vercel api /v9/projects/{idOrName}/domains/{domain} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_project_domain: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** The project domain name */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the environment variable for a given project. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/env/{id} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_project_env: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** The unique ID for the environment variable to get the decrypted value. */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns the OTEL trace for a given Vercel CLI request. CLI fallback on MCP failure (partial): vercel api /v1/projects/traces --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_project_trace: {
      /** The project ID */
      projectId: string
      /** The Vercel CLI request ID associated with the trace */
      requestId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a read-only domain registration quote for the selected team. Checks availability and pricing and returns payment-method, tax/fee, registration, and auto-renew disclosures, plus a signed quote token valid for five minutes. Requesting a quote does not authorize a purchase, enable auto-renew, register, reserve, or charge for a domain. Digital subscriptions, credits, and add-ons cannot be quoted or purchased through this tool. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__get_purchase_quote: {
      /** Only domain registration quotes are available. */
      product: "domain"
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The domain to register, e.g. "example.com". */
      domain: string
      /** Registration term in years. Defaults to the TLD minimum. */
      years?: number
      /** Whether to auto-renew at term end. Defaults to true. Not part of the signed quote token. */
      autoRenew?: boolean
    }
    /** Retrieves a list of DNS records created for a domain name. By default it returns 20 records if no limit is provided. The rest can be retrieved using the pagination options. CLI fallback on MCP failure (partial): vercel api /v5/domains/{domain}/records --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_records: {
      domain: string
      /** Maximum number of records to list from a request. */
      limit?: string
      /** Get records created after this JavaScript timestamp. */
      since?: string
      /** Get records created before this JavaScript timestamp. */
      until?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Check the status of Remote Caching for this principal. Returns a JSON-encoded status indicating if Remote Caching is enabled, disabled, or disabled due to usage limits. CLI fallback on MCP failure (partial): vercel api /v8/artifacts/status --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_remote_cache_status: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Return the Rolling Release for a project, regardless of whether the rollout is active, aborted, or completed. If the feature is enabled but no deployment has occurred yet, null will be returned. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_rolling_release: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Filter by rolling release state */
      state?: "ACTIVE" | "COMPLETE" | "ABORTED"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the Rolling Releases billing status for a project. The team level billing status is used to determine if the project can be configured for rolling releases. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release/billing --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_rolling_release_billing_status: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the Rolling Releases configuration for a project. The project-level config is simply a template that will be used for any future rolling release, and not the configuration for any active rolling release. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release/config --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_rolling_release_config: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get grouped runtime error clusters for a project (error name, occurrence count, affected routes, sample messages, first/last seen). Use this first to answer "why is production erroring" — it reads a pre-aggregated table and does not time out. For recent windows, pass since like "24h" or "7d" and omit until; until is only needed for historical end times. Max 7-day range. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} logs --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_runtime_errors: {
      /** The project ID to get runtime errors for. */
      projectId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** Start of the window as an ISO date or relative lookback from now (e.g. "1h", "24h", "7d"). Defaults to 24h ago; max lookback is 7d. */
      since?: string
      /** Optional end of the window as an ISO date, relative lookback, or "now". Omit this when the end should be the current time. */
      until?: string
      /** Comma-separated route paths to filter by (e.g. "/api/checkout"). */
      routes?: string
    }
    /** Get runtime logs for a project or deployment. Runtime logs return individual log records and show application output (console.log, errors, etc.) from functions and daemons during execution. Supports filtering by environment, log level, source, time range, and full-text search. The default window is the latest 50 minutes. For recent windows, pass since like "30m" and omit until; until is only needed for historical end times. For wide time ranges, scope to a deploymentId for speed, or use group_by to get counts instead of individual lines. To investigate production errors specifically, prefer get_runtime_errors. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} logs --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_runtime_logs: {
      /** The project ID to get runtime logs for. */
      projectId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** Filter logs to a specific deployment ID or URL. */
      deploymentId?: string
      /** Filter by environment: "production" or "preview". */
      environment?: "production" | "preview"
      /** Filter by log level(s). Can specify multiple levels. */
      level?: Array<"error" | "warning" | "info" | "fatal">
      /** Filter by raw log source(s): function or daemon. */
      source?: Array<"function" | "daemon">
      /** Start of the window as an ISO date or relative lookback from now (e.g., "1h", "30m", "7d"). Defaults to the 50 minutes before until (or now), within Hobby’s retention window. */
      since?: string
      /** Optional end of the window as an ISO date, relative lookback, or "now". Omit this when the end should be the current time. */
      until?: string
      /** Maximum number of log entries to return. Defaults to 50, max 100. */
      limit?: number
      /** Full-text search query to filter logs. */
      query?: string
      /** Filter by specific request ID. */
      requestId?: string
      /** Return counts grouped by this attribute instead of individual log lines. Use for "how many errors", "source breakdown", "top paths". Fast even over wide time ranges. */
      group_by?: "requestPath" | "level" | "source" | "deploymentId" | "branch"
    }
    /** Retrieves detailed information about a specific session, including its current status, resource configuration, and exposed routes. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_session: {
      /** The unique identifier of the session to retrieve. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves the current status and details of a command executed in a session. Use the `wait` parameter to block until the command finishes execution. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/cmd/{cmdId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_session_command: {
      /** The unique identifier of the session containing the command. */
      sessionId: string
      /** The unique identifier of the command to retrieve. */
      cmdId: string
      /** If set to "true", the request will block until the command finishes execution. Useful for synchronously waiting for command completion. */
      wait?: "true" | "false"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Streams the output of a command in real-time using newline-delimited JSON (ND-JSON). Each entry includes the output data and stream type. Stream types include `stdout`, `stderr`, and `error` (for stream failures). CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/cmd/{cmdId}/logs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_session_command_logs: {
      /** The unique identifier of the session containing the command. */
      sessionId: string
      /** The unique identifier of the command to stream logs for. */
      cmdId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves detailed information about a specific snapshot, including its creation time, size, expiration date, and the source session it was created from. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/snapshots/{snapshotId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_session_snapshot: {
      /** The unique identifier of the snapshot to retrieve. */
      snapshotId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the decrypted value of a Shared Environment Variable by id. CLI fallback on MCP failure (partial): vercel api /v1/env/{id} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_shared_env_var: {
      /** The unique ID for the Shared Environment Variable to get the decrypted value. */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a store CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} storage get {storeId}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_storage_stores_by_id: {
      id: string
      skipMetadata?: boolean
      includeGuides?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get information for the Team specified by the `teamId` parameter. CLI fallback on MCP failure (partial): vercel api /v2/teams/{teamId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_team: {
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      /** Team ID to use for this operation. */
      teamId: string
    }
    /** Get the metadata for a specific TLD. CLI fallback on MCP failure (partial): vercel api /v1/registrar/tlds/{tld} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_tld: {
      /** A valid TLD name */
      tld: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get price data for a specific TLD. This only reflects base prices for the given TLD. Premium domains may have different prices. Use the [Get price data for a domain](https://vercel.com/docs/rest-api/reference/endpoints/domains-registrar/get-price-data-for-a-domain) endpoint to get the price data for a specific domain. CLI fallback on MCP failure (partial): vercel api /v1/registrar/tlds/{tld}/price --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_tld_price: {
      /** A valid TLD name */
      tld: string
      /** The number of years to get the price for. If not provided, the minimum number of years for the TLD will be used. */
      years?: string
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Get a specific toolbar thread by ID, including all messages and context. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} comments inspect {threadId} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_toolbar_thread: {
      /** The thread ID to retrieve */
      threadId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
    }
    /** Get Invocation CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_invocation: {
      invocationId: string
      attempt: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get Invocation Logs CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/logs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_invocation_logs: {
      invocationId: string
      attempt: string
      /** Only return log lines with one of these levels. */
      level?: Array<"trace" | "debug" | "command" | "info" | "warn" | "error" | "systemError" | "fatal">
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns an invocation attempt together with every job definition, its latest job run, and the task definitions and active task runs of that job run. Defaults to the latest attempt when `attempt` is omitted. With `follow=1` the response is a newline-delimited JSON stream: a `{"type":"tree", ...}` event with the full tree is sent immediately and again whenever it changes, and a final `{"type":"end","reason":...}` event is sent when the attempt finishes (`completed`) or the stream reaches its maximum duration (`timeout`), after which clients should reconnect. CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/tree --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_invocation_tree: {
      invocationId: string
      /** Invocation attempt to return. Defaults to the latest attempt. */
      attempt?: string
      /** When 1, stream the tree as newline-delimited JSON until the attempt finishes. */
      follow?: 0 | 1
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get Job Definition CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_job_definition: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get Job Run CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId}/runs/{runAttempt} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_job_run: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      runAttempt: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get Job Run Logs CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId}/runs/{runAttempt}/logs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_job_run_logs: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      runAttempt: string
      follow?: 0 | 1
      since?: number
      /** Only return log lines with one of these levels. */
      level?: Array<"trace" | "debug" | "command" | "info" | "warn" | "error" | "systemError" | "fatal">
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns log lines for the tasks of an invocation attempt in a single request, grouped by task. Tasks can be narrowed by name and by conclusion, for example `conclusion=failed` to fetch only the logs of failed tasks. CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/task-logs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_task_logs: {
      invocationId: string
      attempt: string
      /** Only return tasks with one of these names (e.g., \"web#test\"). */
      task?: string[]
      /** Only return completed tasks with one of these conclusions. */
      conclusion?: Array<"succeeded" | "cached" | "failed" | "skipped">
      /** Only return log lines with one of these levels. */
      level?: Array<"trace" | "debug" | "command" | "info" | "warn" | "error" | "systemError" | "fatal">
      /** Maximum number of tasks to return (default: 10, max: 25). */
      limit?: number
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get Task Run Logs With `follow=1` the response is a newline-delimited JSON stream of log lines that ends once the task run has finished and its logs are flushed, or when the stream reaches its maximum duration. CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId}/runs/{runAttempt}/task-definitions/{taskDefinitionId}/runs/{taskRunAttempt}/logs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_vercel_ci_task_run_logs: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      runAttempt: string
      taskDefinitionId: string
      taskRunAttempt: string
      /** When 1, stream log lines as newline-delimited JSON until the task run finishes. */
      follow?: 0 | 1
      since?: number
      /** Only return log lines with one of these levels. */
      level?: Array<"trace" | "debug" | "command" | "info" | "warn" | "error" | "systemError" | "fatal">
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a list of webhooks CLI fallback on MCP failure (partial): vercel api /v1/webhooks --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__get_webhooks: {
      projectId?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Lists git namespaces for a supported provider. Supported providers are `github`, `gitlab` and `bitbucket`. If the provider is not provided, it will try to obtain it from the user that authenticated the request. CLI fallback on MCP failure (partial): vercel api /v1/integrations/git-namespaces --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__git_namespaces: {
      /** The custom Git host if using a custom Git provider, like GitHub Enterprise Server */
      host?: string
      provider?: "github" | "github-limited" | "github-custom-host" | "gitlab" | "bitbucket"
      /** When true, includes the viewer object for each namespace. */
      viewerMetadata?: boolean
    }
    /** Import a design into Vercel from a publicly fetchable URL. The file is a self-contained HTML bundle with all images, fonts, and styles inlined. CLI fallback: unavailable. */
    "mcp__claude_ai_Vercel__import-claude-design-from-url": {
      /** Public HTTPS URL to the design file. Valid for ~1 hour. Fetched server-side. */
      url: string
      /** Suggested title for the imported design. */
      title?: string
      /** Stable Claude Design project identifier. Reuse it to update the same imported Vercel project. */
      claude_design_project_id?: string
    }
    /** Marks a source image as stale, causing its corresponding transformed images to be revalidated in the background on the next request. CLI fallback on MCP failure (partial): vercel api /v1/edge-cache/invalidate-by-src-images --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__invalidate_by_src_images: {
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        srcImages: string[]
      }
    }
    /** Marks a cache tag as stale, causing cache entries associated with that tag to be revalidated in the background on the next request. CLI fallback on MCP failure (partial): vercel api /v1/edge-cache/invalidate-by-tags --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__invalidate_by_tags: {
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        tags: string[] | string
        target?: "production" | "preview"
      }
    }
    /** Issue a new cert CLI fallback on MCP failure (partial): vercel api /v8/certs --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__issue_cert: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The common names the cert should be issued for */
        cns?: string[]
      }
    }
    /** Sends a signal to terminate a running command in a session. The signal can be used to gracefully stop (SIGTERM) or forcefully kill (SIGKILL) the process. The command must still be running for this operation to succeed. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/cmd/{cmdId}/kill --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__kill_session_command: {
      /** The unique identifier of the command to terminate. */
      cmdId: string
      /** The unique identifier of the session containing the command. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The POSIX signal number to send to the process. Common values: 15 (SIGTERM) for graceful termination, 9 (SIGKILL) for forced termination. */
        signal: number
      }
    }
    /** List members of an access group CLI fallback on MCP failure (partial): vercel api /v1/access-groups/{idOrName}/members --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_access_group_members: {
      /** The ID or name of the Access Group. */
      idOrName: string
      /** Limit how many access group members should be returned. */
      limit?: number
      /** Continuation cursor to retrieve the next page of results. */
      next?: string
      /** Search project members by their name, username, and email. */
      search?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List projects of an access group CLI fallback on MCP failure (partial): vercel api /v1/access-groups/{idOrName}/projects --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_access_group_projects: {
      /** The ID or name of the Access Group. */
      idOrName: string
      /** Limit how many access group projects should be returned. */
      limit?: number
      /** Continuation cursor to retrieve the next page of results. */
      next?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List access groups CLI fallback on MCP failure (partial): vercel api /v1/access-groups --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_access_groups: {
      /** Filter access groups by project. */
      projectId?: string
      /** Search for access groups by name. */
      search?: string
      /** Number of members to include in the response. */
      membersLimit?: number
      /** Number of projects to include in the response. */
      projectsLimit?: number
      /** Limit how many access group should be returned. */
      limit?: number
      /** Continuation cursor to retrieve the next page of results. */
      next?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List projects in a Vercel team that have Agent Runs observability data for agents built with the eve framework, with run counts and average duration rollups. Use this to discover which projects have eve agent activity before drilling into a project. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} agent-runs projects. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_agent_run_projects: {
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** Agent run environment, usually "production" or "preview". Defaults to "production". */
      environment?: string
      /** Preset time range. Ignored when both from and to are provided. Defaults to the dashboard endpoint default. */
      period?: "5m" | "15m" | "1h" | "6h" | "12h" | "1d" | "3d" | "7d" | "14d" | "30d" | "90d"
      /** Start time as ISO 8601, Unix seconds, Unix milliseconds, or a relative duration like "12h". Must be used with to. */
      from?: string
      /** End time as ISO 8601, Unix seconds, Unix milliseconds, a relative duration like "1h", or "now". Must be used with from. */
      to?: string
    }
    /** List Agent Runs for a Vercel project. Agent Runs are the observability layer for agents built with the eve framework. The response includes summaries, status, model, trigger, token usage, time series, and pagination metadata. Use this to find recent or matching production eve agent runs before fetching detail or trace data. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} agent-runs list --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_agent_runs: {
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The project ID to get the deployment events for. Alternatively the project slug can be used. Project IDs start with "prj_". If you do not know the project ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the projectId - Use the `list_projects` tool */
      projectId: string
      /** Agent run environment, usually "production" or "preview". Defaults to "production". */
      environment?: string
      /** Preset time range. Ignored when both from and to are provided. Defaults to the dashboard endpoint default. */
      period?: "5m" | "15m" | "1h" | "6h" | "12h" | "1d" | "3d" | "7d" | "14d" | "30d" | "90d"
      /** Start time as ISO 8601, Unix seconds, Unix milliseconds, or a relative duration like "12h". Must be used with to. */
      from?: string
      /** End time as ISO 8601, Unix seconds, Unix milliseconds, a relative duration like "1h", or "now". Must be used with from. */
      to?: string
      /** 1-based page number. Defaults to 1. */
      page?: number
      /** Number of runs per page. The dashboard endpoint caps this at 100. */
      pageSize?: number
      /** Server-side title search for Agent Runs. */
      search?: string
    }
    /** Retrieves a list of aliases for the authenticated User or Team. When `domain` is provided, only aliases for that domain will be returned. When `projectId` is provided, it will only return the given project aliases. CLI fallback on MCP failure (partial): vercel api /v4/aliases --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_aliases: {
      /** Get only aliases of the given domain name */
      domain?: string[] | string
      /** Get only aliases created after the provided timestamp */
      from?: number
      /** Maximum number of aliases to list from a request */
      limit?: number
      /** Filter aliases from the given `projectId` */
      projectId?: string
      /** Get aliases created after this JavaScript timestamp */
      since?: number
      /** Get aliases created before this JavaScript timestamp */
      until?: number
      /** Get aliases that would be rolled back for the given deployment */
      rollbackDeploymentId?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns the billing charge data in FOCUS v1.3 JSONL format for a specified Vercel team, within a date range specified by `from` and `to` query parameters. Supports 1-day granularity with a maximum date range of 1 year. The response is streamed as newline-delimited JSON (JSONL) and can be optionally compressed with gzip if the `Accept-Encoding: gzip` header is provided. This is only available for Owner, Member, Developer, Security, Billing, and Enterprise Viewer roles for the supplied team. CLI fallback on MCP failure (partial): vercel api /v1/billing/charges --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_billing_charges: {
      /** Inclusive start of the date range as an ISO 8601 date-time string in UTC. */
      from: string
      /** Exclusive end of the date range as an ISO 8601 date-time string in UTC. */
      to: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the version history for a project's bulk redirects CLI fallback on MCP failure (partial): vercel api /v1/bulk-redirects/versions --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_bulk_redirect_versions: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List a project's bulk redirect rules, optionally selecting a version, filtering rules, or comparing versions. Supports sorting and pagination. Use list_bulk_redirect_versions for version history. CLI fallback on MCP failure (partial): vercel api /v1/bulk-redirects --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_bulk_redirects: {
      projectId: string
      versionId?: string
      q?: string
      diff?: boolean | "only"
      page?: number
      perPage?: number
      sortBy?: "source" | "destination" | "statusCode"
      sortOrder?: "asc" | "desc"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get certs CLI fallback on MCP failure (partial): vercel api /v8/certs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_certs: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List the projects connected to a connector and the environments where each connection is available. CLI fallback on MCP failure (partial): vercel api /v2/connect/connectors/{connector}/projects --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_connector_project_connections: {
      /** Stable connector ID or URL-encoded team-scoped UID. Examples: `scl_abc123` or `slack%2Fmy-bot`. */
      connector: string
      /** Maximum number of project connections to return. Defaults to 50. */
      limit?: number
      /** Cursor from `pagination.next` on the previous response. */
      cursor?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List connectors that belong to a team. CLI fallback on MCP failure (partial): vercel api /v2/connect/connectors --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_connectors: {
      /** Maximum number of connectors to return. Defaults to 20. */
      limit?: number
      /** Cursor from `pagination.next` on the previous response. */
      cursor?: string
      /** Return only connectors connected to this project. */
      projectId?: string
      /** Search connector names, UIDs, and services. */
      search?: string
      /** Comma-separated connector types: `slack`, `discord`, `github`, `linear`, `linq`, `salesforce`, `sendblue`, `snowflake`, `snowflake-wif`, `microsoft-entra`, `api-key`, `photon`, `oauth`, or `custom`. */
      type?: string
      /** Comma-separated provider or service identifiers. */
      service?: string
      /** Sort by name in ascending order, or by creation or update time in descending order. */
      sort?: "name" | "createdAt" | "updatedAt"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns commitment allocations per contract period in FOCUS v1.3 JSONL format for a specified Vercel team. The response is streamed as newline-delimited JSON (JSONL). This endpoint is only applicable to Enterprise Vercel customers. An empty response is returned for non-Enterprise (Pro/Flex) customers. CLI fallback on MCP failure (partial): vercel api /v1/billing/contract-commitments --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_contract_commitments: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves all Aliases for the Deployment with the given ID. The authenticated user or team must own the deployment. CLI fallback on MCP failure (partial): vercel api /v2/deployments/{id}/aliases --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_deployment_aliases: {
      /** The ID of the deployment the aliases should be listed for */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the build logs of a deployment by deployment ID and build ID. It can work as an infinite stream of logs or as a JSON endpoint depending on the input parameters. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} inspect {deploymentIdOrUrl} --logs. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_deployment_events: {
      /** The unique identifier or hostname of the deployment. */
      idOrUrl: string
      /** Order of the returned events based on the timestamp. */
      direction?: "backward" | "forward"
      /** When enabled, this endpoint will return live events as they happen. */
      follow?: 0 | 1
      /** Maximum number of events to return. Provide `-1` to return all available logs. */
      limit?: number
      /** Deployment build ID. */
      name?: string
      /** Timestamp for when build logs should be pulled from. */
      since?: number
      /** Timestamp for when the build logs should be pulled up until. */
      until?: number
      /** HTTP status code range to filter events by. */
      statusCode?: number | string
      delimiter?: 0 | 1
      builds?: 0 | 1
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Allows to retrieve the file structure of the source code of a deployment by supplying the deployment unique identifier. If the deployment was created with the Vercel CLI or the API directly with the `files` key, it will have a file tree that can be retrievable. CLI fallback on MCP failure (partial): vercel api /v6/deployments/{id}/files --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_deployment_files: {
      /** The unique deployment identifier */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List deployments under the authenticated user or team. If a deployment hasn't finished uploading (is incomplete), the `url` property will have a value of `null`. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} list {projectName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_deployments: {
      /** Name of the deployment. */
      app?: string
      /** Gets the deployment created after this Date timestamp. (default: current time) */
      from?: number
      /** Maximum number of deployments to list from a request. */
      limit?: number
      /** Filter deployments from the given ID or name. */
      projectId?: string
      /** Filter deployments from the given project IDs. Cannot be used when projectId is specified. */
      projectIds?: string[]
      /** Filter deployments based on the environment. */
      target?: string
      /** Gets the deployment created before this Date timestamp. (default: current time) */
      to?: number
      /** Filter out deployments based on users who have created the deployment. */
      users?: string
      /** Get Deployments created after this JavaScript timestamp. */
      since?: number
      /** Get Deployments created before this JavaScript timestamp. */
      until?: number
      /** Filter deployments based on their state (`BUILDING`, `ERROR`, `INITIALIZING`, `QUEUED`, `READY`, `CANCELED`, `BLOCKED`) */
      state?: string
      /** Filter deployments based on their rollback candidacy */
      rollbackCandidate?: boolean
      /** Filter deployments based on the branch name */
      branch?: string
      /** Filter deployments based on the SHA */
      sha?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a list of domains registered for the authenticated user or team. By default it returns the last 20 domains if no limit is provided. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} domains list. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_domains: {
      /** Maximum number of domains to list from a request. */
      limit?: number
      /** Get domains created after this JavaScript timestamp. */
      since?: number
      /** Get domains created before this JavaScript timestamp. */
      until?: number
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Allows to retrieve the list of Drains of the authenticated team. CLI fallback on MCP failure (partial): vercel api /v1/drains --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_drains: {
      projectId?: string
      includeMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns the list of user-facing event types with descriptions. CLI fallback on MCP failure (partial): vercel api /v1/events/types --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_event_types: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Gets all SDK keys for a project. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags sdk-keys list --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_feature_flag_sdk_keys: {
      /** The project id or name */
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List all feature flag segments for a project. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectIdOrName}/feature-flags/segments --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_flag_segments: {
      /** The project id or name */
      projectIdOrName: string
      /** Whether to include metadata */
      withMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Lists flag versions for a given flag. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectIdOrName}/feature-flags/flags/{flagIdOrSlug}/versions --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_flag_versions: {
      projectIdOrName: string
      flagIdOrSlug: string
      limit?: number
      /** Pagination cursor */
      cursor?: string
      /** Environment to filter by */
      environment?: string
      /** Whether to include metadata */
      withMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve feature flags for a project. The list can be filtered by state and supports pagination. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags list --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_flags: {
      /** The project id or name */
      projectIdOrName: string
      /** The state of the flags to retrieve. Defaults to `active`. */
      state?: "active" | "archived"
      /** Deprecated. Whether to include creator metadata in each flag in the response. Resolve creator identity client-side (e.g. via the team members endpoint) instead; this parameter will be removed in a future release. Use `GET /v1/projects/:id/feature-flags/flags/:flagIdOrSlug?withMetadata=true` for single-flag lookups that need creator metadata. */
      withMetadata?: boolean
      /** Maximum number of flags to return. When not set, all flags are returned. */
      limit?: number
      /** Pagination cursor to continue from. */
      cursor?: string
      /** Search flags by their slug or description. Case-insensitive. */
      search?: string
      /** Filter flags by tag. Repeat the parameter for multiple tags (all must match). */
      tags?: string[]
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve feature flags for a project. Returns an opaque cursor for pagination. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags list --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_flags_v2: {
      /** The project id or name */
      projectIdOrName: string
      /** The state of the flags to retrieve. Defaults to `active`. */
      state?: "active" | "archived"
      /** Maximum number of flags to return. */
      limit?: number
      /** Pagination cursor to continue from. */
      cursor?: string
      /** Search flags by their slug or description. Case-insensitive. */
      search?: string
      /** Filter flags by tag. Repeat the parameter for multiple tags (all must match). */
      tags?: string[]
      /** Filter flags by the id of the entity that created them (a user or team id). */
      createdBy?: string
      /** Filter flags by maintainer user id. Repeat the parameter for multiple maintainers (any may match). */
      maintainerIds?: string[]
      /** Whether to include Marketplace experimentation items in the paginated response. Defaults to false. */
      includeMarketplaceFlags?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a list of billing plans for an integration and product. CLI fallback on MCP failure (partial): vercel api /v1/integrations/integration/{integrationIdOrSlug}/products/{productIdOrSlug}/plans --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_integration_billing_plans: {
      integrationIdOrSlug: string
      integrationConfigurationId?: string
      productIdOrSlug: string
      metadata?: string
      source?: "marketplace" | "deploy-button" | "external" | "v0" | "resource-claims" | "cli" | "oauth" | "backoffice" | "import-recommended-integrations" | "organization"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Returns products available for an integration configuration. Each product includes a `metadataSchema` field with the JSON Schema for required and optional metadata fields. CLI fallback on MCP failure (partial): vercel api /v1/integrations/configuration/{id}/products --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_integration_configuration_products: {
      /** ID of the integration configuration */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Allows to retrieve all configurations for an authenticated integration. When the `project` view is used, configurations generated for the authorization flow will be filtered out of the results. CLI fallback on MCP failure (partial): vercel api /v1/integrations/configurations --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_integration_configurations: {
      view: "account" | "project"
      installationType?: "marketplace" | "external" | "provisioning"
      /** ID of the integration */
      integrationIdOrSlug?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the list of KMS issuers that belong to the authenticated team. The results are paginated. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_kms_issuers: {
      /** Maximum number of issuers to return. */
      limit?: number
      /** Continuation cursor to retrieve the next page of results. */
      next?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a paginated list of named sandboxes belonging to a specific project. Results can be sorted by creation time or name, and optionally filtered by name prefix or status. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_named_sandboxes: {
      /** The unique identifier or name of the project to list named sandboxes for. */
      project: string
      /** Maximum number of named sandboxes to return in the response. Used for pagination. */
      limit?: number
      /** Field to sort by. */
      sortBy?: "createdAt" | "name" | "statusUpdatedAt" | "currentSnapshotId"
      /** Filter named sandboxes whose name starts with this prefix. Only valid when sortBy=name. */
      namePrefix?: string
      /** Opaque pagination cursor from a previous response. */
      cursor?: string
      /** Sort direction. Defaults to desc. */
      sortOrder?: "asc" | "desc"
      /** Filter named sandboxes by status. Only valid when sortBy is createdAt. */
      status?: "running" | "stopping" | "stopped"
      /** Filter sandboxes by tag. Format: \"key:value\". Only one tag filter is supported at a time. */
      tags?: string | string[]
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List the connectors connected to a project and the environments where each connection is available. CLI fallback on MCP failure (partial): vercel api /v2/connect/projects/{projectId}/connectors --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_project_connector_connections: {
      /** Vercel project ID. */
      projectId: string
      /** Maximum number of connector connections to return. Defaults to 50. */
      limit?: number
      /** Cursor from `pagination.next` on the previous response. */
      cursor?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve custom environments for the project. Must not be named 'Production' or 'Preview'. CLI fallback on MCP failure (partial): vercel api /v9/projects/{idOrName}/custom-environments --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_project_custom_environments: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Fetch custom environments for a specific git branch */
      gitBranch?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve the domains associated with a given project by passing either the project `id` or `name` in the URL. CLI fallback on MCP failure (partial): vercel api /v9/projects/{idOrName}/domains --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_project_domains: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Filters only production domains when set to `true`. */
      production?: "true" | "false"
      /** Filters on the target of the domain. Can be either "production", "preview" */
      target?: "production" | "preview"
      /** The unique custom environment identifier within the project */
      customEnvironmentId?: string
      /** Filters domains based on specific branch. */
      gitBranch?: string
      /** Excludes redirect project domains when "false". Includes redirect project domains when "true" (default). */
      redirects?: "true" | "false"
      /** Filters domains based on their redirect target. */
      redirect?: string
      /** Filters domains based on their verification status. */
      verified?: "true" | "false"
      /** Maximum number of domains to list from a request (max 100). */
      limit?: number
      /** Get domains created after this JavaScript timestamp. */
      since?: number
      /** Get domains created before this JavaScript timestamp. */
      until?: number
      /** Domains sort order by createdAt */
      order?: "ASC" | "DESC"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the version history for a project's routing rules. Returns the staging version (if one exists) followed by production versions, most recent first. The staging version has `isStaging: true` and the current production version has `isLive: true`. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes/versions --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_project_route_versions: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get the routing rules for a project. Supports searching by name/ID/pattern, filtering by route type, and diffing staged changes against production. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_project_routes: {
      projectId: string
      versionId?: string
      q?: string
      filter?: "rewrite" | "redirect" | "set_status" | "transform"
      diff?: boolean | "only"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Allows to retrieve the list of projects of the authenticated user or team. The list will be paginated and the provided query parameters allow filtering the returned projects. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} project list. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_projects: {
      /** Query only projects updated after the given timestamp or continuation token. */
      from?: string
      /** Specifies whether PRs from Git forks should require a team member's authorization before it can be deployed */
      gitForkProtection?: "0" | "1"
      /** Limit the number of projects returned */
      limit?: string
      /** Search projects by the name field */
      search?: string
      /** Filter results by repo. Also used for project count */
      repo?: string
      /** Filter results by Repository ID. */
      repoId?: string
      /** Filter results by Repository URL. */
      repoUrl?: string
      /** Filter results by excluding those projects that belong to a repo */
      excludeRepos?: string
      /** Filter results by connected Global Config ID */
      edgeConfigId?: string
      /** Filter results by connected Global Config Token ID */
      edgeConfigTokenId?: string
      deprecated?: boolean
      /** Filter results by projects with elastic concurrency enabled */
      elasticConcurrencyEnabled?: "0" | "1"
      /** Filter results by projects with Static IPs enabled */
      staticIpsEnabled?: "0" | "1"
      /** Filter results by effective build machine types. Accepts comma-separated values. Use \"elastic\" for projects with elastic selection and \"default\" for projects without a build machine type set. */
      buildMachineTypes?: string
      /** Filter results by build queue configuration. SKIP_NAMESPACE_QUEUE includes projects without a configuration set. */
      buildQueueConfiguration?: "SKIP_NAMESPACE_QUEUE" | "WAIT_FOR_NAMESPACE_QUEUE"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a list of aliases related to the last promote request with their mapping status CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/promote/aliases --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_promote_aliases: {
      projectId: string
      /** Maximum number of aliases to list from a request (max 100). */
      limit?: number
      /** Get aliases created after this epoch timestamp. */
      since?: number
      /** Get aliases created before this epoch timestamp. */
      until?: number
      /** Filter results down to aliases that failed to map to the requested deployment */
      failedOnly?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a list of all commands that have been executed in a session, including their current status, exit codes, and execution times, ordered from the most recent to the oldest. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/cmd --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_session_commands: {
      /** The unique identifier of the session to list commands for. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a paginated list of snapshots for a specific project. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/snapshots --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_session_snapshots: {
      /** The unique identifier or name of the project to list snapshots for. */
      project: string
      /** Name for the sandbox. Must be unique per project and URL-safe (alphanumeric, hyphens, underscores). */
      name?: string
      /** Maximum number of snapshots to return in the response. Used for pagination. */
      limit?: number
      /** Opaque pagination cursor from a previous response. */
      cursor?: string
      /** Sort direction for results by creation time. */
      sortOrder?: "asc" | "desc"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieves a paginated list of sessions belonging to a specific sandbox. Results are sorted by creation time and paginated using an opaque cursor. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_sessions: {
      /** The unique identifier or name of the project to list sessions for. */
      project: string
      /** Filter sessions by sandbox name. Only sessions belonging to the specified sandbox are returned. */
      name?: string
      /** Maximum number of sessions to return in the response. Used for pagination. */
      limit?: number
      /** Opaque pagination cursor from a previous response. */
      cursor?: string
      /** Sort direction for results by creation time. */
      sortOrder?: "asc" | "desc"
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a list of TLDs supported by Vercel CLI fallback on MCP failure (partial): vercel api /v1/registrar/tlds/supported --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_supported_tlds: {
      /** Team ID to use for this operation. */
      teamId?: string
    }
    /** Retrieve feature flag settings for projects in a team. CLI fallback on MCP failure (partial): vercel api /v1/teams/{teamId}/feature-flags/settings --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_team_flag_settings: {
      /** Maximum number of settings to return. */
      limit?: number
      /** Pagination cursor to continue from. */
      cursor?: string
      /** Team ID to use for this operation. */
      teamId: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve all feature flags for a team across all projects. The list can be filtered by state and supports pagination. CLI fallback on MCP failure (partial): vercel api /v1/teams/{teamId}/feature-flags/flags --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_team_flags: {
      /** The state of the flags to retrieve. Defaults to `active`. */
      state?: "active" | "archived"
      /** Deprecated. Whether to include creator metadata in each flag in the response. Resolve creator identity client-side (e.g. via the team members endpoint) instead; this parameter will be removed in a future release. */
      withMetadata?: boolean
      /** Maximum number of flags to return. */
      limit?: number
      /** Pagination cursor to continue from. */
      cursor?: string
      /** Search flags by their slug or description. Case-insensitive. */
      search?: string
      /** The kind of flags to retrieve. */
      kind?: "boolean" | "string" | "number" | "json"
      /** Filter flags by tag. Repeat the parameter for multiple tags (all must match). */
      tags?: string[]
      /** Team ID to use for this operation. */
      teamId: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Retrieve all feature flags for a team across all projects. Returns an opaque cursor for pagination. CLI fallback on MCP failure (partial): vercel api /v2/teams/{teamId}/feature-flags/flags --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_team_flags_v2: {
      /** The state of the flags to retrieve. Defaults to `active`. */
      state?: "active" | "archived"
      /** Maximum number of flags to return. */
      limit?: number
      /** Pagination cursor to continue from. */
      cursor?: string
      /** Search flags by their slug or description. Case-insensitive. */
      search?: string
      /** The kind of flags to retrieve. */
      kind?: "boolean" | "string" | "number" | "json"
      /** Filter flags by tag. Repeat the parameter for multiple tags (all must match). */
      tags?: string[]
      /** Filter flags by the id of the entity that created them (a user or team id). */
      createdBy?: string
      /** Filter flags by maintainer user id. Repeat the parameter for multiple maintainers (any may match). */
      maintainerIds?: string[]
      /** Whether to include Marketplace experimentation items in the paginated response. Defaults to false. */
      includeMarketplaceFlags?: boolean
      /** Team ID to use for this operation. */
      teamId: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a paginated list of team members for the provided team. CLI fallback on MCP failure (partial): vercel api /v3/teams/{teamId}/members --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_team_members: {
      /** Limit how many teams should be returned */
      limit?: number
      /** Timestamp in milliseconds to only include members added since then. */
      since?: number
      /** Timestamp in milliseconds to only include members added until then. */
      until?: number
      /** Search team members by their name, username, and email. */
      search?: string
      /** Only return members with the specified team role. */
      role?: "OWNER" | "MEMBER" | "DEVELOPER" | "SECURITY" | "BILLING" | "VIEWER" | "VIEWER_FOR_PLUS" | "CONTRIBUTOR"
      /** Exclude members who belong to the specified project. */
      excludeProject?: string
      /** Include team members who are eligible to be members of the specified project. */
      eligibleMembersForProjectId?: string
      /** Team ID to use for this operation. */
      teamId: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Get a paginated list of all the Teams the authenticated User is a member of. CLI fallback on MCP failure (partial): vercel teams list. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_teams: {
      /** Maximum number of Teams which may be returned. */
      limit?: number
      /** Timestamp (in milliseconds) to only include Teams created since then. */
      since?: number
      /** Timestamp (in milliseconds) to only include Teams created until then. */
      until?: number
    }
    /** List Vercel toolbar comment threads for a team. Returns unresolved threads by default. Use this to see feedback, comments, or discussions on deployments and previews. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} --cwd {linkedProjectPath} comments --all-branches. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_toolbar_threads: {
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** Filter by project ID */
      projectId?: string
      /** Filter by branch name */
      branch?: string
      /** Filter by status. Defaults to unresolved. */
      status?: "resolved" | "unresolved"
      /** Filter by page path (e.g. /docs) or glob (e.g. /docs*) */
      page?: string
      /** Search text in comments */
      search?: string
      /** Maximum number of results to return. Defaults to 20. */
      limit?: number
      /** Pagination offset */
      offset?: number
    }
    /** Retrieves a list of "events" generated by the User on Vercel. Events are generated when the User performs a particular action, such as logging in, creating a deployment, and joining a Team (just to name a few). When the `teamId` parameter is supplied, then the events that are returned will be in relation to the Team that was specified. CLI fallback on MCP failure (partial): vercel api /v3/events --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_user_events: {
      /** Maximum number of items which may be returned. */
      limit?: number
      /** Timestamp to only include items created since then. */
      since?: string
      /** Timestamp to only include items created until then. */
      until?: string
      /** Comma-delimited list of event "types" to filter the results by. */
      types?: string
      /** Deprecated. Use `principalId` instead. If `principalId` and `userId` both exist, `principalId` will be used. */
      userId?: string
      /** When retrieving events for a Team, the `principalId` parameter may be specified to filter events generated by a specific principal. */
      principalId?: string
      /** Comma-delimited list of project IDs to filter the results by. */
      projectIds?: string
      /** Filters events to those associated with a specific entity (matched against `payload.id`). For example, a connector ID. */
      entityId?: string
      /** When set to `true`, the response will include the `payload` field for each event. */
      withPayload?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List Invocation Attempts CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_vercel_ci_invocation_attempts: {
      invocationId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List Invocations CLI fallback on MCP failure (partial): vercel api /v2/vercel-ci/invocations --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_vercel_ci_invocations: {
      /** Repository provider (e.g., \"github\"). */
      provider?: "github" | "gitlab" | "bitbucket" | "vercel"
      /** Repository slug (e.g., \"vercel/next.js\"). */
      repository?: string
      /** Branch name (e.g., \"main\"). */
      branchName?: string
      /** Snapshot/commit hash. */
      snapshot?: string
      status?: Array<"new" | "skipped" | "bootstrapping" | "bootstrapping_failed" | "snapshotted" | "sandbox_named" | "jobs_on_hive_clone_dispatched" | "jobs_on_hive_dispatched" | "jobs_on_hive_completed" | "jobs_on_hive_failed" | "awaiting_jobs" | "completed">
      conclusion?: Array<"succeeded" | "failed" | "skipped">
      source?: Array<"vercel-ci" | "vercel-native-checks">
      authorGitHubId?: string
      /** GitHub author login. */
      author?: string
      createdAfter?: number
      createdBefore?: number
      /** Number of results per page (default: 20, max: 100). */
      limit?: number
      /** Pagination cursor from a previous response. */
      cursor?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List Job Definitions CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_vercel_ci_job_definitions: {
      invocationId: string
      attempt: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List Job Runs CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId}/runs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_vercel_ci_job_runs: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List Task Definitions CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId}/runs/{runAttempt}/task-definitions --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_vercel_ci_task_definitions: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      runAttempt: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** List Task Runs CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/job-definitions/{jobDefinitionId}/runs/{runAttempt}/task-runs --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__list_vercel_ci_task_runs: {
      invocationId: string
      attempt: string
      jobDefinitionId: string
      runAttempt: string
      taskRunAttempt?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Update multiple Global Config Items in batch. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/items --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__patch_edge_config_items: {
      edgeConfigId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        items: Array<{
          operation: "create"
          key: string
          value: unknown
          description?: string | null
        } | {
          operation: "update" | "upsert"
          key: string
          value: unknown
          description?: string | null
        } | {
          operation: "update" | "upsert"
          key: string
          value?: unknown
          description: string | null
        } | {
          operation: "delete"
          key: unknown
          value?: unknown
          description?: string | null
        }>
      }
    }
    /** Update the protection bypass for the alias or deployment URL (used for user access & comment access for deployments). Used as shareable links and user scoped access for Vercel Authentication and also to allow external (logged in) people to comment on previews for Preview Comments (next-live-mode). CLI fallback on MCP failure (partial): vercel api /aliases/{id}/protection-bypass --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__patch_url_protection_bypass: {
      /** The alias or deployment ID */
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** Optional time the shareable link is valid for in seconds. If not provided, the shareable link will never expire. */
        ttl?: number
        /** Optional instructions for revoking and regenerating a shareable link */
        revoke?: {
          /** Sharebale link to revoked */
          secret: string
          /** Whether or not a new shareable link should be created after the provided secret is revoked */
          regenerate: boolean
        }
      } | {
        /** Instructions for creating a user scoped protection bypass */
        scope: ({
          /** Specified user id for the scoped bypass. */
          userId?: string
          /** Specified email for the scoped bypass. */
          email?: string
          /** Invitation status for the user scoped bypass. */
          access?: "denied" | "granted"
        }) & unknown & unknown
      } | {
        override: {
          scope: "alias-protection-override"
          action: "create" | "revoke"
        }
      }
    }
    /** Pause a project by passing its project `id` in the URL. If the project does not exist given the id then the request will fail with 400 status code. If the project disables auto assigning custom production domains and blocks the active Production Deployment then the request will return with 200 status code. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} project pause {projectName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__pause_project: {
      /** The unique project identifier */
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Set the firewall configuration to provided rules and settings. Creates or overwrite the existing firewall configuration. CLI fallback on MCP failure (partial): vercel api /v1/security/firewall/config --method PUT. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__put_firewall_config: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        firewallEnabled: boolean
        managedRules?: {}
        /** Custom Ruleset */
        crs?: {
          /** Scanner Detection - Detect and prevent reconnaissance activities from network scanning tools. */
          sd?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Multipart Attack - Block attempts to bypass security controls using multipart/form-data encoding. */
          ma?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Local File Inclusion Attack - Prevent unauthorized access to local files through web applications. */
          lfi?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Remote File Inclusion Attack - Prohibit unauthorized upload or execution of remote files. */
          rfi?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Remote Execution Attack - Prevent unauthorized execution of remote scripts or commands. */
          rce?: {
            active: boolean
            action: "deny" | "log"
          }
          /** PHP Attack - Safeguard against vulnerability exploits in PHP-based applications. */
          php?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Generic Attack - Provide broad protection from various undefined or novel attack vectors. */
          gen?: {
            active: boolean
            action: "deny" | "log"
          }
          /** XSS Attack - Prevent injection of malicious scripts into trusted webpages. */
          xss?: {
            active: boolean
            action: "deny" | "log"
          }
          /** SQL Injection Attack - Prohibit unauthorized use of SQL commands to manipulate databases. */
          sqli?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Session Fixation Attack - Prevent unauthorized takeover of user sessions by enforcing unique session IDs. */
          sf?: {
            active: boolean
            action: "deny" | "log"
          }
          /** Java Attack - Mitigate risks of exploitation targeting Java-based applications or components. */
          java?: {
            active: boolean
            action: "deny" | "log"
          }
        }
        rules?: Array<{
          id?: string
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              /** [Parameter](https://vercel.com/docs/security/vercel-waf/rule-configuration#parameters) from the incoming traffic. */
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          action: {
            mitigate?: {
              action: "log" | "challenge" | "deny" | "bypass" | "rate_limit" | "redirect"
              rateLimit?: {
                algo: "fixed_window" | "token_bucket"
                window: number
                limit: number
                keys: string[]
                action?: "log" | "challenge" | "deny" | "rate_limit" | unknown | null
              } | unknown | null
              redirect?: {
                location: string
                permanent: boolean
              } | unknown | null
              actionDuration?: string | null
              bypassSystem?: boolean | null
              logHeaders?: string | string[]
            }
          }
          valid?: boolean
          validationErrors?: string[] | string
        }>
        rulesets?: Array<{
          id?: string
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          action?: {
            mitigate?: {
              action: "deny" | "challenge" | "log"
            }
          }
          valid?: boolean
          validationErrors?: string[] | string
        }> | {}
        ips?: Array<{
          id?: string
          hostname: string
          ip: string
          notes?: string
          action: "deny" | "challenge" | "log" | "bypass"
        }>
        botIdEnabled?: boolean
        logHeaders?: string | string[]
      }
    }
    /** Allows to read an access group CLI fallback on MCP failure (partial): vercel api /v1/access-groups/{idOrName} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__read_access_group: {
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Allows reading an access group project CLI fallback on MCP failure (partial): vercel api /v1/access-groups/{accessGroupIdOrName}/projects/{projectId} --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__read_access_group_project: {
      accessGroupIdOrName: string
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Downloads the contents of a file from a session's filesystem. The file content is returned as a binary stream with appropriate Content-Disposition headers for file download. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__read_session_file: {
      /** The unique identifier of the session to read the file from. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** The base directory for resolving relative paths. If not specified, paths are resolved from the sandbox home directory. */
        cwd?: string
        /** The path of the file to read. Can be absolute or relative to the working directory. */
        path: string
      }
    }
    /** Records an artifacts cache usage event. The body of this request is an array of cache usage events. The supported event types are `HIT` and `MISS`. The source is either `LOCAL` the cache event was on the users filesystem cache or `REMOTE` if the cache event is for a remote cache. When the event is a `HIT` the request also accepts a number `duration` which is the time taken to generate the artifact in the cache. CLI fallback on MCP failure (partial): vercel api /v8/artifacts/events --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__record_events: {
      /** The continuous integration or delivery environment where this artifact is downloaded. */
      xArtifactClientCi?: string
      /** 1 if the client is an interactive shell. Otherwise 0 */
      xArtifactClientInteractive?: number
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: Array<{
        /** A UUID (universally unique identifer) for the session that generated this event. */
        sessionId: string
        /** One of `LOCAL` or `REMOTE`. `LOCAL` specifies that the cache event was from the user's filesystem cache. `REMOTE` specifies that the cache event is from a remote cache. */
        source: "LOCAL" | "REMOTE"
        /** One of `HIT` or `MISS`. `HIT` specifies that a cached artifact for `hash` was found in the cache. `MISS` specifies that a cached artifact with `hash` was not found. */
        event: "HIT" | "MISS"
        /** The artifact hash */
        hash: string
        /** The time taken to generate the artifact. This should be sent as a body parameter on `HIT` events. */
        duration?: number
      }>
    }
    /** Replace the DNS records for a domain using a BIND zone file supplied in requestBody. Overwrites existing records and can disrupt domain routing or verification. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} dns import {domain} {zoneFilePath}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__replace_domain_dns_records: {
      /** The domain name */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** DNS records in BIND zone-file format. */
      requestBody: string
    }
    /** Add a reply message to an existing toolbar thread. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} comments reply {threadId} -m {message} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__reply_to_toolbar_thread: {
      /** The thread ID to reply to */
      threadId: string
      /** The team ID to get the deployment events for. Alternatively the team slug can be used. Team IDs start with "team_". If you do not know the team ID or slug, it can be found through these mechanism: - Read the file .vercel/project.json if it exists and extract the orgId - Use the `list_teams` tool */
      teamId: string
      /** The message content in markdown format */
      markdown: string
    }
    /** Allows users to promote a deployment to production. Note: This does NOT rebuild the deployment. If you need that, then call create-deployments endpoint. CLI fallback on MCP failure (partial): vercel api /v10/projects/{projectId}/promote/{deploymentId} --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__request_promote: {
      projectId: string
      deploymentId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Allows users to rollback to a deployment. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/rollback/{deploymentId} --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__request_rollback: {
      projectId: string
      /** The ID of the deployment to rollback *to* */
      deploymentId: string
      /** The reason for the rollback */
      description?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Rerequest a selected check that has failed. CLI fallback on MCP failure (partial): vercel api /v1/deployments/{deploymentId}/checks/{checkId}/rerequest --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__rerequest_check: {
      /** The deployment to rerun the check for. */
      deploymentId: string
      /** The check to rerun */
      checkId: string
      /** Mark the check as running */
      autoUpdate?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Restores a Global Config backup. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId}/backups/{edgeConfigBackupVersionId}/restore --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__restore_edge_config_backup: {
      edgeConfigId: string
      edgeConfigBackupVersionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Restores the provided redirects in the staging version to the value in the production version. If no production version exists, removes the redirects from staging. CLI fallback on MCP failure (partial): vercel api /v1/bulk-redirects/restore --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__restore_redirects: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        name?: string
        /** The redirects to restore. The source of the redirect is used to match the redirect to restore. */
        redirects: string[]
      }
    }
    /** Retry a terminal Vercel CI invocation attempt identified by invocationId and attempt. Starts another attempt; inspect its state to determine whether it completes successfully. CLI fallback on MCP failure (partial): vercel api /v1/vercel-ci/invocations/{invocationId}/attempts/{attempt}/retry --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__retry_vercel_ci_invocation: {
      invocationId: string
      attempt: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Immediately revoke a signing key that is already scheduled for revocation. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId}/keys/{keyId}/revoke --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__revoke_kms_signing_key: {
      /** The ID of the issuer. */
      issuerId: string
      /** The ID of the signing key to revoke immediately. The key must already be scheduled for revocation. */
      keyId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Executes a shell command inside a running session. The command runs asynchronously and returns immediately with a command ID that can be used to track its progress and retrieve its output. Optionally, use the `wait` parameter to stream the command status until completion. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/cmd --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__run_session_command: {
      /** The unique identifier of the session in which to execute the command. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The executable or shell command to run. This is the program name without arguments. */
        command: string
        /** Arguments to pass to the command. Each argument should be a separate array element. */
        args?: string[]
        /** The working directory in which to execute the command. Defaults to the sandbox home directory if not specified. */
        cwd?: string
        /** Additional environment variables to set for this command. These are merged with the sandbox environment. */
        env?: {}
        /** Execute the command with root (superuser) privileges. */
        sudo?: boolean
        /** If true, returns an ND-JSON stream that emits the command status when started and again when finished. Useful for synchronously waiting for command completion. */
        wait?: boolean
        /** If true, stream the logs of the command execution in real-time via ND-JSON. This is only applicable if `wait` is also true. */
        logs?: boolean
        /** Maximum duration in milliseconds the command may run before it is killed with SIGKILL, up to 5 hours. Enforced at exec time, independently of `wait`. */
        timeout?: number
      }
    }
    /** Start domain research here. Get registration availability and pricing for 1–200 exact domain names. Returns results in input order, with registration and renewal prices in USD for available domains. No authentication required. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} domains search {query}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__search_domains: {
      /** Team ID to use for this operation. */
      teamId?: string
      requestBody: {
        /** an array of at most 200 item(s) */
        domains: string[]
      }
    }
    /** Lists git repositories linked to a namespace `id` for a supported provider. A specific namespace `id` can be obtained via the `git-namespaces` endpoint. Supported providers are `github`, `gitlab` and `bitbucket`. If the provider or namespace is not provided, it will try to obtain it from the user that authenticated the request. CLI fallback on MCP failure (partial): vercel api /v1/integrations/search-repo --method GET. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__search_repo: {
      query?: string
      namespaceId?: string | number | null
      provider?: "github" | "github-limited" | "github-custom-host" | "gitlab" | "bitbucket" | "cursor-origin"
      installationId?: string
      /** The custom Git host if using a custom Git provider, like GitHub Enterprise Server */
      host?: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
    }
    /** Search the Vercel documentation. Use this tool to answer any questions about Vercel’s platform, features, and best practices, including: - Core Concepts: Projects, Deployments, Git Integration, Preview Deployments, Environments - Frontend & Frameworks: Next.js, SvelteKit, Nuxt, Astro, Remix, frameworks configuration and optimization - APIs: REST API, Vercel SDK, Build Output API - Compute: Fluid Compute, Functions, Routing Middleware, Cron Jobs, OG Image Generation, Sandbox, Data Cache - AI: Vercel AI SDK, AI Gateway, MCP, v0 - Performance & Delivery: Edge Network, Caching, CDN, Image Optimization, Headers, Redirects, Rewrites - Pricing: Plans, Spend Management, Billing - Security: Audit Logs, Firewall, Bot Management, BotID, OIDC, RBAC, Secure Compute, 2FA - Storage: Blog, Edge Config CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__search_vercel_documentation: {
      /** Topic to focus the documentation search on (e.g., 'routing', 'data-fetching'). */
      topic: string
      /** Maximum number of tokens to include in the result. Default is 2500. */
      tokens?: number
    }
    /** Stages new redirects for a project and returns the new version. CLI fallback on MCP failure (partial): vercel api /v1/bulk-redirects --method PUT. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__stage_redirects: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        projectId: string
        teamId: string
        overwrite?: boolean
        name?: string
        redirects?: Array<{
          source: string
          destination: string
          statusCode?: number | string
          permanent?: boolean
          caseSensitive?: boolean
          query?: boolean
          preserveQueryParams?: boolean
        }>
      }
    }
    /** Stage routing rules for a project. Set `overwrite` to true to replace all existing rules, or omit it to merge with existing rules by ID. Returns the new staged version. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes --method PUT. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__stage_routes: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        overwrite?: boolean
        routes?: Array<{
          id: string
          name: string
          description?: string
          enabled?: boolean
          route: {
            src: string
            dest?: string
            headers?: {}
            caseSensitive?: boolean
            status?: number
            has?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            missing?: Array<{
              type?: "host" | "header" | "cookie" | "query"
              key?: string
              value?: string
            }>
            transforms?: Array<{
              type?: "request.headers" | "request.query" | "response.headers"
              op?: "append" | "set" | "delete"
              target?: {}
              args?: unknown
              env?: string[]
            }>
            respectOriginCacheControl?: boolean
          }
        }>
      }
    }
    /** Start a rolling release for a deployment. If a rolling release is already active for the same canary deployment, returns the current state without side effects. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release/start --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__start_rolling_release: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The ID of the canary deployment to start the rolling release for */
        canaryDeploymentId: string
      }
    }
    /** Stops a running session and releases its allocated resources. All running processes within the session will be terminated. This action cannot be undone. A stopped session cannot be restarted. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/stop --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__stop_session: {
      /** The unique identifier of the session to stop. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Validate the delivery configuration of a Drain using sample events. CLI fallback on MCP failure (partial): vercel api /v1/drains/test --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__test_drain: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        schemas: {
          log: {
            version: "v1"
          }
        } | {
          trace: {
            version: "v1"
          }
        } | {
          analytics: {
            version: "v1"
          }
        } | {
          speed_insights: {
            version: "v1"
          }
        }
        delivery: {} & ({
          type: string
          endpoint: string
          compression?: "gzip" | "none"
          encoding: "json" | "ndjson"
          headers: {}
          secret?: string
        } | {
          type: string
          endpoint: {
            traces: string
          }
          encoding: "proto" | "json"
          headers: {}
          secret?: string
        } | {
          type: string
          endpoint: string
          encoding: "json" | "ndjson"
          compression: "none"
          fileStructure: "hive"
          roleArn: string
          region: string
          serverSideEncryption?: "AES256" | "aws:kms" | "aws:kms:dsse"
          objectAcl?: "private" | "bucket-owner-read" | "bucket-owner-full-control"
        })
      }
    }
    /** Unpause a project by passing its project `id` in the URL. If the project does not exist given the id then the request will fail with 400 status code. If the project enables auto assigning custom production domains and unblocks the active Production Deployment then the request will return with 200 status code. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} project resume {projectName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__unpause_project: {
      /** The unique project identifier */
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Update the setting for determining if the project has Attack Challenge mode enabled. CLI fallback on MCP failure (partial): vercel api /v1/security/attack-mode --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_attack_challenge_mode: {
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        projectId: string
        attackModeEnabled?: boolean
        attackModeActiveUntil?: number
      }
    }
    /** Manage a project's bulk redirect version by ID. Each call selects one of the three fixed action values in the input schema: promote publishes a staged version to production; restore republishes a previous production version; discard deletes a staged version without changing production. Promote and restore change live redirect rules. CLI fallback on MCP failure (partial): vercel api /v1/bulk-redirects/versions --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_bulk_redirect_version: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        id: string
        action: "promote" | "restore" | "discard"
        name?: string
      }
    }
    /** Update metadata, trigger enablement, and event subscriptions for an existing connector ID. Provider credentials and keys stay in the configured connector; changes to provider data or trigger credentials must be made outside MCP. CLI fallback on MCP failure (partial): vercel api /v2/connect/connectors/{connector} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_connector: {
      /** Stable connector ID or URL-encoded team-scoped UID. Examples: `scl_abc123` or `slack%2Fmy-bot`. */
      connector: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      /** Connector fields to update. */
      requestBody: {
        /** Whether the triggers are enabled for this connector. */
        triggers?: boolean
        /** Default trigger events for this connector. */
        events?: string[]
        /** SHA-1 digest of a PNG or JPEG icon that is at least 640 by 640 pixels. This field does not accept a URL or image bytes. First compute the digest and upload the raw image with [POST /v2/files](https://vercel.com/docs/rest-api/deployments/upload-deployment-files). Send `Content-Length` and the same 40-character digest in `x-vercel-digest`. Then set `icon` to that digest. ```js import { createHash } from 'node:crypto'; import { readFile } from 'node:fs/promises'; const VERCEL_TOKEN = process.env.VERCEL_TOKEN; const connectorId = 'scl_...'; const bytes = await readFile('icon.png'); const digest = createHash('sha1').update(bytes).digest('hex'); await fetch('https://api.vercel.com/v2/files', { method: 'POST', headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/octet-stream', 'Content-Length': String(bytes.length), 'x-vercel-digest': digest, }, body: bytes, }); await fetch(`https://api.vercel.com/v2/connect/connectors/${connectorId}`, { method: 'PATCH', headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json', }, body: JSON.stringify({ icon: digest }), }); ``` */
        icon?: string
        backgroundColor?: string
        accentColor?: string
        /** Full team-scoped UID, such as `slack/my-bot`. It cannot contain whitespace, `%`, `#`, control characters, or Vercel-owned namespaces. Changing it breaks callers that use the old UID. The stable connector ID does not change. */
        uid?: string
        /** Display name for the connector. It is trimmed and cannot be empty or contain control characters. */
        name?: string
      }
    }
    /** Update the configuration of an existing drain. CLI fallback on MCP failure (partial): vercel api /v1/drains/{id} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_drain: {
      id: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        name?: string
        projects?: "some" | "all"
        projectIds?: string[] | null
        filter?: string | {
          version: string
          filter: {
            type: string
            project?: {
              ids?: string[]
            }
            log?: {
              sources?: Array<"build" | "edge" | "lambda" | "static" | "external" | "firewall" | "redirect">
            }
            deployment?: {
              environments?: Array<"production" | "preview">
            }
          } | {
            type: string
            text: string
          }
        }
        schemas?: {
          log: {
            version: "v1"
          }
        } | {
          trace: {
            version: "v1"
          }
        } | {
          analytics: {
            version: "v1"
          }
        } | {
          speed_insights: {
            version: "v1"
          }
        }
        delivery?: {} & ({
          type: string
          endpoint: string
          compression?: "gzip" | "none"
          encoding: "json" | "ndjson"
          headers: {}
          secret?: string
        } | {
          type: string
          endpoint: {
            traces: string
          }
          encoding: "proto" | "json"
          headers: {}
          secret?: string
        } | {
          type: string
          endpoint: string
          encoding: "json" | "ndjson"
          compression: "none"
          fileStructure: "hive"
          roleArn: string
          region: string
          serverSideEncryption?: "AES256" | "aws:kms" | "aws:kms:dsse"
          objectAcl?: "private" | "bucket-owner-read" | "bucket-owner-full-control"
        })
        sampling?: Array<{
          type: string
          /** Sampling rate from 0 to 1 (e.g., 0.1 for 10%) */
          rate: number
          /** Environment to apply sampling to */
          env?: "production" | "preview"
          /** Request path prefix to apply the sampling rule to */
          requestPath?: string
        }> | null
        transforms?: {
          id: string
        }[] | null
        status?: "enabled" | "disabled"
        source?: {} & unknown
      }
    }
    /** Updates a Global Config. CLI fallback on MCP failure (partial): vercel api /v1/global-config/{edgeConfigId} --method PUT. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_edge_config: {
      edgeConfigId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        slug: string
      }
    }
    /** Apply one firewall configuration change to a project. action selects from a fixed set of operations documented in the input schema, each with its matching id/value schema: rulesets.insert/update/remove/priority manage rulesets; conditions.insert/update/remove manage named conditions; rulesetAction.update/remove set or clear a consumed ruleset mitigation; firewallEnabled toggles the firewall; rules.insert/update/remove/priority manage custom rules; crs.update/disable manage a CRS rule; ip.insert/update/remove manage IP rules; managedRules.update and managedRuleGroup.update configure managed protections; botId.toggle toggles BotID; logHeaders.update configures logged headers. Insert creates, update modifies, remove deletes, and priority reorders. Use the exact action values from the input schema. CLI fallback on MCP failure (partial): vercel api /v1/security/firewall/config --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_firewall_config: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        action: "rulesets.insert"
        id?: null
        value: {
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          action?: {
            mitigate?: {
              action: "deny" | "challenge" | "log"
            }
          }
          valid?: boolean
          validationErrors?: string[] | string
        }
      } | {
        action: "rulesets.update"
        id: unknown | null
        value: {
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          action?: {
            mitigate?: {
              action: "deny" | "challenge" | "log"
            }
          }
          valid?: boolean
          validationErrors?: string[] | string
        }
      } | {
        action: "rulesets.remove"
        id: string
        value?: null
      } | {
        action: "rulesets.priority"
        id: string
        value: number
      } | {
        action: "conditions.insert"
        id?: null
        value: {
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          valid?: boolean
          validationErrors?: string[] | string
        }
      } | {
        action: "conditions.update"
        id: string
        value: {
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          valid?: boolean
          validationErrors?: string[] | string
        }
      } | {
        action: "conditions.remove"
        id: unknown | null
        value?: null
      } | {
        action: "rulesetAction.update"
        id: unknown | null
        value: {
          action: "deny" | "challenge" | "log" | "allow"
        }
      } | {
        action: "rulesetAction.remove"
        id: string
        value?: null
      } | {
        action: "firewallEnabled"
        id?: null
        value: boolean
      } | {
        action: "rules.insert"
        id?: null
        value: {
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          action: {
            mitigate?: {
              action: "log" | "challenge" | "deny" | "bypass" | "rate_limit" | "redirect"
              rateLimit?: {
                algo: "fixed_window" | "token_bucket"
                window: number
                limit: number
                keys: string[]
                action?: "log" | "challenge" | "deny" | "rate_limit" | string
              } | string
              redirect?: {
                location: string
                permanent: boolean
              } | string
              actionDuration?: string | null
              bypassSystem?: boolean | null
              logHeaders?: string | string[]
            }
          }
          valid?: boolean
          validationErrors?: string[] | string
        }
      } | {
        action: "rules.update"
        id: string
        value: {
          name: string
          description?: string
          active: boolean
          conditionGroup: Array<{
            conditions: Array<{
              type: "host" | "path" | "method" | "header" | "query" | "cookie" | "target_path" | "route" | "raw_path" | "ip_address" | "region" | "protocol" | "scheme" | "environment" | "domain_environment" | "user_agent" | "geo_continent" | "geo_country" | "geo_country_region" | "geo_city" | "geo_as_number" | "ja4_digest" | "ja3_digest" | "rate_limit_api_id" | "server_action" | "bot_name" | "bot_category" | "bot_status" | "bot_protection" | "shared_condition" | "traffic_source" | "ruleset"
              op: "re" | "eq" | "neq" | "ex" | "nex" | "inc" | "ninc" | "pre" | "suf" | "sub" | "gt" | "gte" | "lt" | "lte" | "list"
              neg?: boolean
              key?: string
              value?: string | string[] | number
            }>
          }>
          action: {
            mitigate?: {
              action: "log" | "challenge" | "deny" | "bypass" | "rate_limit" | "redirect"
              rateLimit?: {
                algo: "fixed_window" | "token_bucket"
                window: number
                limit: number
                keys: string[]
                action?: "log" | "challenge" | "deny" | "rate_limit" | string
              } | string
              redirect?: {
                location: string
                permanent: boolean
              } | string
              actionDuration?: string | null
              bypassSystem?: boolean | null
              logHeaders?: string | string[]
            }
          }
          valid?: boolean
          validationErrors?: string[] | string
        }
      } | {
        action: "rules.remove"
        id: string
        value?: null
      } | {
        action: "rules.priority"
        id: string
        value: number
      } | {
        action: "crs.update"
        id: "sd" | "ma" | "lfi" | "rfi" | "rce" | "php" | "gen" | "xss" | "sqli" | "sf" | "java"
        value: {
          active: boolean
          action: "deny" | "log"
        }
      } | {
        action: "crs.disable"
        id?: null
        value?: null
      } | {
        action: "ip.insert"
        id?: null
        value: {
          hostname: string
          ip: string
          notes?: string
          action: "deny" | "challenge" | "log" | "bypass"
        }
      } | {
        action: "ip.update"
        id: string
        value: {
          hostname: string
          ip: string
          notes?: string
          action: "deny" | "challenge" | "log" | "bypass"
        }
      } | {
        action: "ip.remove"
        id: string
        value?: null
      } | {
        action: "managedRules.update"
        id: "ai_bots" | "bot_filter" | "bot_protection" | "traffic_sources" | "vercel_ruleset" | "owasp"
        value: {
          action?: "log" | "challenge" | "deny"
          active: boolean
        }
      } | {
        action: "managedRuleGroup.update"
        id: "ai_bots" | "bot_filter" | "bot_protection" | "traffic_sources" | "vercel_ruleset" | "owasp"
        value: {}
      } | {
        action: "botId.toggle"
        id?: null
        value: boolean
      } | {
        action: "logHeaders.update"
        id?: null
        value: "*" | string[] | null
      }
    }
    /** Update an existing feature flag. This endpoint supports partial updates, allowing you to modify specific properties like variants, environments, or state without providing the full flag configuration. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} flags update {flagIdOrSlug} --project {projectIdOrName}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_flag: {
      /** The project id or name */
      projectIdOrName: string
      /** The flag id or name */
      flagIdOrSlug: string
      /** Etag to match, can be used interchangeably with the `if-match` header */
      ifMatch?: string
      /** Whether to include metadata in the response */
      withMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The user who created this patch */
        createdBy?: string
        /** Additional message for this version */
        message?: string
        /** The variants of the flag */
        variants?: Array<{
          /** The id of the variant */
          id: string
          /** A label for the variant */
          label?: string
          /** A description of the variant */
          description?: string
          value: string | number | boolean | {} | unknown[]
        }>
        /** The configuration for the flag in different environments */
        environments?: {}
        /** A random seed to prevent split points in different flags from having the same targets */
        seed?: number
        /** A description of the flag */
        description?: string
        state?: "active" | "archived"
        /** The user ids of the maintainers of the flag */
        maintainerIds?: string[]
        /** Whether this flag is marked as permanent, indicating it should not be removed */
        permanent?: boolean
        /** Tags for categorizing the flag */
        tags?: string[]
      }
    }
    /** Update an existing feature flag segment. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectIdOrName}/feature-flags/segments/{segmentIdOrSlug} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_flag_segment: {
      /** The project id or name */
      projectIdOrName: string
      /** The segment slug */
      segmentIdOrSlug: string
      /** Whether to include metadata */
      withMetadata?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        operations?: Array<{
          action: "add" | "remove"
          field: "include" | "exclude"
          entity: string
          attribute: string
          value: {
            note?: string
            value: string
          }
        }>
        label?: string
        description?: string
        /** The data of the segment */
        data?: {
          rules?: Array<{
            id: string
            conditions: Array<{
              lhs: {
                type: unknown
              } | {
                type: unknown
                kind: string
                attribute: string
              }
              cmp: "eq" | "!eq" | "oneOf" | "!oneOf" | "containsAllOf" | "containsAnyOf" | "containsNoneOf" | "startsWith" | "!startsWith" | "endsWith" | "!endsWith" | "contains" | "!contains" | "ex" | "!ex" | "gt" | "gte" | "lt" | "lte" | "regex" | "!regex" | "before" | "after"
              rhs?: {
                type: "list/inline" | "list"
                items: Array<{
                  label?: string
                  note?: string
                  value: number
                } | {
                  label?: string
                  note?: string
                  value: string
                }>
              } | {
                type: unknown
                pattern: string
                flags: string
              } | string | number | boolean
              cmpOptions?: {
                ignoreCase?: boolean
              }
            }>
            outcome: {
              type: unknown
            } | {
              type: unknown
              base: {
                type: unknown
                kind: string
                attribute: string
              }
              passPromille: number
            }
          }>
          include?: {}
          exclude?: {}
        }
        hint?: string
      }
    }
    /** Update feature flag settings for a project. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectIdOrName}/feature-flags/settings --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_flag_settings: {
      /** The project id or name */
      projectIdOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        enabled?: boolean
        entities?: {
          kind: string
          label: string
          attributes: {
            key: string
            type: string
            labels?: {
              label: string
              value: string
            }[]
          }[]
        }[]
        /** The environments to sync */
        environments?: string[]
      }
    }
    /** Update a KMS issuer's name or claims schema. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_kms_issuer: {
      /** The ID of the issuer. */
      issuerId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The name of the issuer. */
        name?: string
        claimsSchema?: {} | null
      }
    }
    /** Update an existing KMS issuer policy's environments or token claims. CLI fallback on MCP failure (partial): vercel api /v1/kms/issuers/{issuerId}/policies/{kind}/{policyKey} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_kms_issuer_policy: {
      /** The ID of the issuer. */
      issuerId: string
      /** The issuer policy kind. */
      kind: "project-grant"
      /** The policy identifier. */
      policyKey: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The environments for the project grant policy. Each entry is a system environment (production, preview, development) or a custom environment ID (env_...). */
        environments?: string[]
        tokenClaims?: {} | null
      }
    }
    /** Update the fields of a project using either its `name` or `id`. CLI fallback on MCP failure (partial): vercel api /v9/projects/{idOrName} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_project: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        autoExposeSystemEnvs?: boolean
        autoAssignCustomDomains?: boolean
        autoAssignCustomDomainsUpdatedBy?: string
        buildCommand?: string | null
        commandForIgnoringBuildStep?: string | null
        /** Specifies whether customer support can see git source for a deployment */
        customerSupportCodeVisibility?: boolean
        devCommand?: string | null
        directoryListing?: boolean
        framework?: null | "container" | "blitzjs" | "nextjs" | "gatsby" | "remix" | "react-router" | "astro" | "hexo" | "eleventy" | "docusaurus-2" | "docusaurus" | "preact" | "solidstart-1" | "solidstart" | "dojo" | "ember" | "vue" | "scully" | "ionic-angular" | "angular" | "polymer" | "svelte" | "sveltekit" | "sveltekit-1" | "ionic-react" | "create-react-app" | "gridsome" | "umijs" | "sapper" | "saber" | "stencil" | "nuxtjs" | "redwoodjs" | "hugo" | "jekyll" | "brunch" | "middleman" | "zola" | "hydrogen" | "vite" | "tanstack-start" | "tanstack-start-lovable" | "vitepress" | "vuepress" | "parcel" | "fastapi" | "flask" | "fasthtml" | "django" | "ash" | "factory-eve" | "eve" | "sanity" | "sanity-v2" | "storybook" | "nitro" | "hono" | "express" | "h3" | "koa" | "nestjs" | "elysia" | "fastify" | "xmcp" | "python" | "ruby" | "rust" | "axum" | "actix-web" | "bun" | "node" | "go" | "services" | "mastra" | null
        /** Specifies whether PRs from Git forks should require a team member's authorization before it can be deployed */
        gitForkProtection?: boolean
        /** Specifies whether Git LFS is enabled for this project. */
        gitLFS?: boolean
        /** Specifies whether sourcemaps are protected and require authentication to access. */
        protectedSourcemaps?: boolean
        installCommand?: string | null
        /** The desired name for the project */
        name?: string
        nodeVersion?: "24.x" | "22.x" | "20.x" | "18.x" | "16.x" | "14.x" | "12.x" | "10.x"
        outputDirectory?: string | null
        previewDeploymentsDisabled?: boolean | null
        previewDeploymentSuffix?: string | null
        /** Specifies resource override configuration for the project */
        resourceConfig?: {
          buildMachineType?: null | "basic" | "enhanced" | "turbo" | "standard" | "elastic"
          buildMachineSelection?: "elastic" | "fixed"
          buildQueue?: {
            configuration?: "SKIP_NAMESPACE_QUEUE" | "WAIT_FOR_NAMESPACE_QUEUE"
          }
          fluid?: boolean
          /** The regions to deploy Vercel Functions to for this project */
          functionDefaultRegions?: string[]
          functionDefaultTimeout?: number
          functionDefaultMemoryType?: "standard_legacy" | "standard" | "performance" | "performance_xl"
          /** Specifies whether Zero Config Failover is enabled for this project. */
          functionZeroConfigFailover?: boolean
          elasticConcurrencyEnabled?: boolean
          buildMachineElasticLastUpdated?: number
          buildMachineElasticReason?: "oom-failure" | "enospc-failure" | "build-timeout-failure" | "basic-floor" | "high-peak-memory" | "sustained-high-cpu" | "high-peak-disk" | "long-build-duration" | "short-build-duration" | "enterprise-floor"
          buildMachineElasticTransition?: {
            at: number
            direction: "upgrade" | "downgrade"
            algorithmVersion: string
          }
          isNSNBDisabled?: boolean
          enableFunctionsBeta?: boolean
        }
        publicSource?: boolean | null
        rootDirectory?: string | null
        serverlessFunctionRegion?: string | null
        /** Specifies whether Zero Config Failover is enabled for this project. */
        serverlessFunctionZeroConfigFailover?: boolean
        /** Deployments created before this absolute datetime have Skew Protection disabled. Value is in milliseconds since epoch to match \"createdAt\" fields. */
        skewProtectionBoundaryAt?: number
        /** Deployments created before this rolling window have Skew Protection disabled. Value is in seconds to match \"revalidate\" fields. */
        skewProtectionMaxAge?: number
        /** Cross-site domains allowed to fetch skew-protected assets (hostnames, optionally with leading wildcard like *.example.com). */
        skewProtectionAllowedDomains?: string[]
        /** Opts-out of the message prompting a CLI user to connect a Git repository in `vercel link`. */
        skipGitConnectDuringLink?: boolean
        /** Indicates if there are source files outside of the root directory */
        sourceFilesOutsideRootDirectory?: boolean
        enablePreviewFeedback?: boolean | null
        enableProductionFeedback?: boolean | null
        /** Opt-in to skip deployments when there are no changes to the root directory and its dependencies */
        enableAffectedProjectsDeployments?: boolean
        /** Specifies whether external rewrite caching is enabled for this project. */
        enableExternalRewriteCaching?: boolean
        /** Manage Static IPs for this project */
        staticIps?: {
          /** Opt-in to Static IPs for this project */
          enabled: boolean
        }
        tracing?: {
          /** Comma-separated list of drain endpoint domains */
          domains?: string
          /** Paths to ignore for tracing */
          ignorePaths?: string[]
          /** Sampling rules for trace collection */
          samplingRules?: Array<{
            /** Sampling rate from 0 to 1 */
            rate: number
            /** Environment to apply sampling to */
            env?: "production" | "preview"
            /** Request path prefix to apply the sampling rule to */
            requestPath?: string
            /** Tracing destination this rule applies to. Derived server-side when project tracing is computed; accepted here so a computed config can round-trip through this endpoint. */
            destination?: "internal" | "external"
          }>
        } | null
        /** OpenID Connect JSON Web Token generation configuration. */
        oidcTokenConfig?: {
          /** Whether or not to generate OpenID Connect JSON Web Tokens. */
          enabled?: boolean
          /** team: `https://oidc.vercel.com/[team_slug]` global: `https://oidc.vercel.com` */
          issuerMode?: "team" | "global"
        }
        passwordProtection?: {
          /** Specify if the password will apply to every Deployment Target or just Preview */
          deploymentType: "all" | "preview" | "prod_deployment_urls_and_all_previews" | "all_except_custom_domains"
          password?: string | null
        } | null
        /** Specifies the default region and failover regions for sandboxes created in the project */
        sandbox?: {
          /** The Vercel region sandboxes in this project are created in by default. */
          region?: "iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1"
          /** The regions sandboxes in this project fall back to when they cannot be created in `region`. */
          failoverRegions?: Array<"iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1">
        }
        ssoProtection?: {
          /** Specify if the Vercel Authentication (SSO Protection) will apply to every Deployment Target or just Preview */
          deploymentType?: "all" | "preview" | "prod_deployment_urls_and_all_previews" | "all_except_custom_domains"
        } | null
        trustedIps?: {
          /** Specify if the Trusted IPs will apply to every Deployment Target or just Preview */
          deploymentType: "all" | "preview" | "production" | "prod_deployment_urls_and_all_previews" | "all_except_custom_domains"
          addresses: Array<{
            /** The IP addresses that are allowlisted. Supports IPv4 addresses and CIDR notations. IPv6 is not supported */
            value: string
            /** An optional note explaining what the IP address or subnet is used for */
            note?: string
          }>
          /** exclusive: ip match is enough to bypass deployment protection (regardless of other settings). additional: ip must match + any other protection should be also provided (password, vercel auth, shareable link, automation bypass header, automation bypass query param) */
          protectionMode: "exclusive" | "additional"
        } | null
        trustedSources?: {
          /** Allow same-team Vercel CI access to preview deployments built from the same repository as the CI run. The deployment source repository, not the current project repository link, is authoritative. Defaults to enabled when not stored. Omitting this field preserves its stored value, including when trustedSources is cleared. Set true explicitly to re-enable. */
          enableVercelCiSameRepository?: boolean
          projects?: {}
          oidcProviders?: {}
        } | null
        deploymentPolicy?: {
          gitSources?: Array<{
            enabled: boolean
            environments: Array<{
              type: "system"
              target: "production" | "preview"
            } | {
              type: "custom"
              environmentId: string
            }>
            sources: Array<{
              provider: "github" | "bitbucket"
              org: string
              repo?: string
            } | {
              provider: "gitlab"
              namespace: string
              project?: string
            }>
          }> | string
          deploymentSources?: Array<{
            enabled: boolean
            environments: Array<{
              type: "system"
              target: "production" | "preview"
            } | {
              type: "custom"
              environmentId: string
            }>
            sources: Array<"git" | "cli" | "rest-api" | "deploy-hook" | "integration" | "v0">
          }> | string
        } | string
        optionsAllowlist?: {
          paths: Array<{
            /** The regex path that should not be protected by Deployment Protection */
            value: string
          }>
        } | null
        connectConfigurations?: Array<{
          /** The ID of the environment */
          envId: string
          /** The ID of the Secure Compute network */
          connectConfigurationId: string
          /** Whether the configuration should be passive, meaning builds will not run there and only passive Serverless Functions will be deployed */
          passive: boolean
          /** Flag saying if project builds should use Secure Compute */
          buildsEnabled: boolean
        }> | null
        /** An array of objects representing a Dismissed Toast in regards to a Project. Objects are either merged with existing toasts (on key match), or added to the `dimissedToasts` array.` */
        dismissedToasts?: Array<{
          /** unique identifier for the dismissed toast */
          key: string
          /** unix timestamp representing the time the toast was dimissed */
          dismissedAt: number
          /** Whether the toast was dismissed, the action was accepted, or the dismissal with this key should be removed */
          action: "cancel" | "accept" | "delete"
          value: string | boolean | number | {
            previousValue: number | boolean | string
            currentValue: number | boolean | string
          }
        }>
      }
    }
    /** Update the deployment protection automation bypass for a project CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/protection-bypass --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_project_protection_bypass: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        /** Optional instructions for revoking and regenerating a automation bypass */
        revoke?: {
          /** Automation bypass to revoked */
          secret: string
          /** Whether or not a new automation bypass should be created after the provided secret is revoked */
          regenerate: boolean
        }
        /** Generate a new secret. If neither generate or revoke are provided, a new random secret will be generated. */
        generate?: {
          /** Optional value of the secret to generate, don't send it for oauth2 tokens */
          secret?: string
          /** Note to be displayed in the UI for this bypass */
          note?: string
        }
        /** Update an existing bypass */
        update?: {
          /** Automation bypass to updated */
          secret: string
          /** Whether or not this bypass is set as the VERCEL_AUTOMATION_BYPASS_SECRET environment variable on deployments */
          isEnvVar?: boolean
          /** Note to be displayed in the UI for this bypass */
          note?: string
        }
      }
    }
    /** Updates an existing DNS record for a domain name. CLI fallback on MCP failure (partial): vercel --scope {teamSlugOrId} dns update {recordId} --value {value}. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_record: {
      /** The id of the DNS record */
      recordId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody: {
        name?: string | null
        value?: string | null
        type?: "A" | "AAAA" | "ALIAS" | "CAA" | "CNAME" | "HTTPS" | "MX" | "SRV" | "TXT" | "NS" | null | null
        ttl?: number | null
        mxPriority?: number | null
        srv?: {
          target: string | null
          weight: number | null
          port: number | null
          priority: number | null
        } | null
        https?: {
          priority: number | null
          target: string | null
          params?: string | null
        } | null
        /** A comment to add context on what this DNS record is for */
        comment?: string
      }
    }
    /** Update (or disable) Rolling Releases for a project. When disabling with the resolve-on-disable feature flag enabled, any active rolling release document is resolved using the disableRolloutAction parameter: "abort" to roll back (default), or "complete" to promote the canary to production. When enabling or updating config, changes only affect the next production deployment and do not alter a rollout that's already in-flight. Note: Enabling Rolling Releases automatically enables skew protection on the project with the default value if it wasn't configured already. CLI fallback on MCP failure (partial): vercel api /v1/projects/{idOrName}/rolling-release/config --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_rolling_release_config: {
      /** Project ID or project name (URL-encoded) */
      idOrName: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Manage a project's routing rule version by ID. Each call selects one of the three fixed action values in the input schema: promote publishes staged routing rules to production; restore republishes a previous production version; discard deletes a staged version without changing production. Promote and restore change live routing. CLI fallback on MCP failure (partial): vercel api /v1/projects/{projectId}/routes/versions --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_route_versions: {
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        id: string
        action: "promote" | "restore" | "discard"
      }
    }
    /** Updates the configuration of a sandbox. Only the provided fields will be modified; omitted fields remain unchanged. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/{name} --method PATCH. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_sandbox: {
      /** The sandbox to update. */
      name: string
      /** The project ID that owns the named sandbox. When provided, takes precedence over OIDC project context. */
      projectId?: string
      /** Whether to automatically resume a stopped named sandbox by creating a new instance from its snapshot. Defaults to false. */
      resume?: boolean
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** Resources to define the VM */
        resources?: {
          /** The number of virtual CPUs to allocate to the sandbox. Must be 1, or an even number. */
          vcpus?: number
          /** The amount of memory in megabytes to allocate to the sandbox. Must equal vcpus * 2048. */
          memory?: number
        }
        /** The runtime environment for the sandbox. Determines the pre-installed language runtimes and tools available. */
        runtime?: "node22" | "node24" | "node26" | "python3.13"
        /** Maximum duration in milliseconds that the sandbox can run before being automatically stopped. */
        timeout?: number
        /** Whether the sandbox persists its state across restarts via automatic snapshots. */
        persistent?: boolean
        /** Default snapshot expiration time in milliseconds. Set to 0 to disable expiration. When set, this value is used as the default expiration for all snapshots created for this sandbox. */
        snapshotExpiration?: unknown | number
        /** Protect the N most recent snapshots with different expiration/deletion behavior. Set to null to clear. */
        keepLastSnapshots?: string | {
          /** Number of most recent snapshots to keep. */
          count: number
          /** Expiration time in milliseconds for kept snapshots. Falls back to snapshotExpiration. */
          expiration?: unknown | number
          /** Whether to immediately delete evicted snapshots. Defaults to true. */
          deleteEvicted?: boolean
        }
        networkPolicy?: {
          /** The network access policy mode. Use \"allow-all\" to permit all outbound traffic. Use \"deny-all\" to block all outbound traffic. Use \"custom\" to specify explicit allow/deny rules. */
          mode: "allow-all" | "deny-all" | "custom" | "default-allow" | "default-deny"
          /** List of domain names the sandbox is allowed to connect to. Only applies when mode is \"custom\". Supports wildcard patterns (e.g., \"*.example.com\" matches all subdomains). */
          allowedDomains?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is allowed to connect to. Traffic to these addresses bypasses domain-based restrictions. */
          allowedCIDRs?: string[]
          /** List of IP address ranges (in CIDR notation) the sandbox is blocked from connecting to. These rules take precedence over all allowed rules. */
          deniedCIDRs?: string[]
          /** HTTP header injection rules for outgoing requests matching specific domains. Traffic to matching domains will be intercepted instead of proxied through encrypted connections. */
          injectionRules?: Array<{
            /** The domain (or pattern) of requests to add headers for. Supports wildcards like *.example.com. */
            domain: string
            /** HTTP headers to inject into requests for this domain. Existing headers with the same name will be overridden. */
            headers: {}
            /** Optional L7 match. When provided, the injection rule only applies to requests that satisfy every specified dimension. When multiple injection rules target the same domain they are evaluated in order and the first match wins; a rule without `match` matches any request and shadows later rules for the same domain. */
            match?: {
              /** Match on the request path. Comparison is case-sensitive. */
              path?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
              /** HTTP methods to match. Any single match succeeds (OR semantics). */
              method?: string[]
              /** Query-string entry matchers. Multiple entries are ANDed. Query parameter names and values are both compared case-sensitively (RFC 3986). When a request has multiple values for the same key, any matching value satisfies the matcher. */
              queryString?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
              /** Header matchers. Multiple entries are ANDed. Header names are compared case-insensitively (RFC 9110); header values are compared case-sensitively. When a request has multiple values for the same header, any matching value satisfies the matcher. */
              headers?: Array<{
                /** Matcher for the entry key (header name or query key). */
                key?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
                /** Matcher for the entry value. */
                value?: {
                  /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                  exact?: string
                  /** Match values that start with the given prefix. */
                  startsWith?: string
                }
              }>
            }
          }>
        } | {
          allow?: string[] | {}
          subnets?: {
            allow?: string[]
            deny?: string[]
          }
        }
        /** The Vercel region in which to create the sandbox. */
        region?: "iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1"
        /** The regions the sandbox falls back to when it cannot be created in `region`. */
        failoverRegions?: Array<"iad1" | "sfo1" | "cle1" | "cdg1" | "fra1" | "arn1" | "sin1" | "pdx1" | "lhr1" | "icn1" | "bom1" | "cpt1" | "dub1" | "gru1" | "hkg1" | "syd1" | "yul1" | "hnd1" | "kix1">
        /** Drives to mount to the sandbox at the provided path. Replaces the current mounts; an empty object removes them all. Changes take effect when the next session starts. */
        mounts?: {}
        /** The Connect network id for the target Secure Compute private network. Set to null to remove the sandbox from Secure Compute. */
        networkId?: string
        /** Default environment variables for the sandbox. Set to empty object to clear. */
        env?: {}
        /** List of ports to expose from the sandbox. Each port will be accessible via a unique URL. Maximum of 15 ports can be exposed. */
        ports?: number[]
        /** The snapshot ID to set as the current snapshot. Must be active and belong to the same project. */
        currentSnapshotId?: string
        /** Key-value tags to associate with the sandbox. Replaces existing tags. Set to empty object to clear. Maximum 5 tags. */
        tags?: {}
      }
    }
    /** Replaces the network access policy of a running session. Use this to control which external hosts the session can communicate with. This is a full replacement. Any previously configured network rules will be overwritten. CLI fallback on MCP failure (partial): vercel api /v2/sandboxes/sessions/{sessionId}/network-policy --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__update_session_network_policy: {
      /** The unique identifier of the session to update the network policy for. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: {
        /** The network access policy mode. Use \"allow-all\" to permit all outbound traffic. Use \"deny-all\" to block all outbound traffic. Use \"custom\" to specify explicit allow/deny rules. */
        mode: "allow-all" | "deny-all" | "custom" | "default-allow" | "default-deny"
        /** List of domain names the sandbox is allowed to connect to. Only applies when mode is \"custom\". Supports wildcard patterns (e.g., \"*.example.com\" matches all subdomains). */
        allowedDomains?: string[]
        /** List of IP address ranges (in CIDR notation) the sandbox is allowed to connect to. Traffic to these addresses bypasses domain-based restrictions. */
        allowedCIDRs?: string[]
        /** List of IP address ranges (in CIDR notation) the sandbox is blocked from connecting to. These rules take precedence over all allowed rules. */
        deniedCIDRs?: string[]
        /** HTTP header injection rules for outgoing requests matching specific domains. Traffic to matching domains will be intercepted instead of proxied through encrypted connections. */
        injectionRules?: Array<{
          /** The domain (or pattern) of requests to add headers for. Supports wildcards like *.example.com. */
          domain: string
          /** HTTP headers to inject into requests for this domain. Existing headers with the same name will be overridden. */
          headers: {}
          /** Optional L7 match. When provided, the injection rule only applies to requests that satisfy every specified dimension. When multiple injection rules target the same domain they are evaluated in order and the first match wins; a rule without `match` matches any request and shadows later rules for the same domain. */
          match?: {
            /** Match on the request path. Comparison is case-sensitive. */
            path?: {
              /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
              exact?: string
              /** Match values that start with the given prefix. */
              startsWith?: string
            }
            /** HTTP methods to match. Any single match succeeds (OR semantics). */
            method?: string[]
            /** Query-string entry matchers. Multiple entries are ANDed. Query parameter names and values are both compared case-sensitively (RFC 3986). When a request has multiple values for the same key, any matching value satisfies the matcher. */
            queryString?: Array<{
              /** Matcher for the entry key (header name or query key). */
              key?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
              /** Matcher for the entry value. */
              value?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
            }>
            /** Header matchers. Multiple entries are ANDed. Header names are compared case-insensitively (RFC 9110); header values are compared case-sensitively. When a request has multiple values for the same header, any matching value satisfies the matcher. */
            headers?: Array<{
              /** Matcher for the entry key (header name or query key). */
              key?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
              /** Matcher for the entry value. */
              value?: {
                /** Match the value exactly. Case-sensitive for paths, header values, and methods; case-insensitive for domains and header keys. */
                exact?: string
                /** Match values that start with the given prefix. */
                startsWith?: string
              }
            }>
          }
        }>
      } | {
        allow?: string[] | {}
        subnets?: {
          allow?: string[]
          deny?: string[]
        }
      }
    }
    /** Uploads a cache artifact identified by the `hash` specified on the path. The cache artifact can then be downloaded with the provided `hash`. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__upload_artifact: {
      /** The artifact size in bytes */
      contentLength: number
      /** The time taken to generate the uploaded artifact in milliseconds. */
      xArtifactDuration?: number
      /** The continuous integration or delivery environment where this artifact was generated. */
      xArtifactClientCi?: string
      /** 1 if the client is an interactive shell. Otherwise 0 */
      xArtifactClientInteractive?: number
      /** The base64 encoded tag for this artifact. The value is sent back to clients when the artifact is downloaded as the header `x-artifact-tag` */
      xArtifactTag?: string
      /** The SHA of the source control revision that generated this artifact. */
      xArtifactSha?: string
      /** A hash representing uncommitted changes in the working directory when this artifact was generated. */
      xArtifactDirtyHash?: string
      /** The artifact hash */
      hash: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      /** Provide this binary value as a base64 string. */
      requestBody: string
    }
    /** Before you create a deployment you need to upload the required files for that deployment. To do it, you need to first upload each file to this endpoint. Once that's completed, you can create a new deployment with the uploaded files. The file content must be placed inside the body of the request. In the case of a successful response you'll receive a status code 200 with an empty body. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__upload_file: {
      /** The file size in bytes */
      contentLength?: number
      /** The file SHA1 used to check the integrity */
      xVercelDigest?: string
      /** The file SHA1 used to check the integrity */
      xNowDigest?: string
      /** The file size as an alternative to `Content-Length` */
      xNowSize?: number
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      /** Provide this binary value as a base64 string. */
      requestBody?: string
    }
    /** Connect a connector to a project, or replace the environments on an existing project connection. CLI fallback on MCP failure (partial): vercel api /v1/connect/connectors/{connector}/projects/{projectId} --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__upsert_connector_project_connection: {
      /** Stable connector ID or URL-encoded team-scoped UID. Examples: `scl_abc123` or `slack%2Fmy-bot`. */
      connector: string
      /** Vercel project ID. */
      projectId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      /** Environments enabled for a connector project connection. */
      requestBody: {
        /** One or more built-in environment names or stable custom environment IDs that belong to the project. Duplicate values are accepted and removed. */
        environments: Array<"development" | "preview" | "production" | string>
      }
    }
    /** Attempts to verify a project domain with `verified = false` by checking the correctness of the project domain's `verification` challenge. CLI fallback on MCP failure (partial): vercel api /v9/projects/{idOrName}/domains/{domain}/verify --method POST. Fill placeholders from inputs. */
    mcp__claude_ai_Vercel__verify_project_domain: {
      /** The unique project identifier or the project name */
      idOrName: string
      /** The domain name you want to verify */
      domain: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      requestBody?: unknown
    }
    /** Creates or reuses a temporary authentication bypass link, then fetches a Vercel deployment URL and returns the response. May follow redirects to external URLs. This is useful if another web fetch tool returns 401 (Unauthorized) or 403 (Forbidden) for a Vercel URL. Supports accessing deployments protected with Vercel Authentication which the user of this MCP server has access to. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__web_fetch_vercel_url: {
      /** The full URL of the Vercel deployment including the path (e.g. "https://myapp.vercel.app/my-page"). */
      url: string
    }
    /** Uploads and extracts files to a session's filesystem. Files must be uploaded as a gzipped tarball (`.tar.gz`) with the `Content-Type` header set to `application/gzip`. The tarball contents are extracted to the session's working directory, or to a custom directory specified via the `x-cwd` header. CLI fallback: unavailable. */
    mcp__claude_ai_Vercel__write_session_files: {
      /** The target directory where the tarball contents will be extracted. If not specified, files are extracted to the sandbox home directory. */
      xCwd?: string
      /** The unique identifier of the session to write files to. */
      sessionId: string
      /** Team ID to use for this operation. */
      teamId?: string
      /** Team slug to use for this operation. Use instead of teamId. */
      slug?: string
      /** A base64-encoded gzipped tarball to extract. Provide this binary value as a base64 string. */
      requestBody: string
    }
    /** Execute a sequence of browser tool calls in ONE round trip. Each item is {name, input} where input is exactly what you'd pass to that tool standalone. Actions execute SEQUENTIALLY (not in parallel) and stop on the first error. Use this tool extensively to quickly execute work whenever you can predict two or more steps ahead — e.g. navigate, click a field, type, press Return, screenshot. Each tool's own permission check runs per item — if an action navigates to a domain without permission, the next item's check fails and the batch stops. Screenshots and other images are returned interleaved with outputs; coordinates you write in THIS batch refer to the screenshot taken BEFORE this call. browser_batch cannot be nested. */
    "mcp__claude-in-chrome__browser_batch": {
      /** List of tool calls to execute sequentially. Example: [{"name":"computer","input":{"action":"left_click","coordinate":[100,200],"tabId":123}},{"name":"computer","input":{"action":"type","text":"hello","tabId":123}},{"name":"navigate","input":{"url":"https://example.com","tabId":123}}] */
      actions: Array<{
        /** Tool name (e.g. computer, navigate, find, tabs_create_mcp). browser_batch cannot be nested. */
        name: string
        /** That tool's input — same shape you'd pass when calling it directly. For computer items whose action is left_click, right_click, double_click, triple_click, left_click_drag, key or type, and for form_input items, include action_summary in the item's input, as you would when calling that tool directly. */
        input: {}
      }>
    }
    /** Use a mouse and keyboard to interact with a web browser, and take screenshots. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. * Whenever you intend to click on an element like an icon, you should consult a screenshot to determine the coordinates of the element before moving the cursor. * If you tried clicking on a program or link but it failed to load, even after waiting, try adjusting your click location so that the tip of the cursor visually falls on the element that you want to click. * Make sure to click any buttons, links, icons, etc with the cursor tip in the center of the element. Don't click boxes on their edges unless asked. */
    "mcp__claude-in-chrome__computer": {
      /** The action to perform: * `left_click`: Click the left mouse button at the specified coordinates. * `right_click`: Click the right mouse button at the specified coordinates to open context menus. * `double_click`: Double-click the left mouse button at the specified coordinates. * `triple_click`: Triple-click the left mouse button at the specified coordinates. * `type`: Type a string of text. * `screenshot`: Take a screenshot of the screen. * `wait`: Wait for a specified number of seconds. * `scroll`: Scroll up, down, left, or right at the specified coordinates. * `key`: Press a specific keyboard key. * `left_click_drag`: Drag from start_coordinate to coordinate. * `zoom`: Take a screenshot of a specific region for closer inspection. * `scroll_to`: Scroll an element into view using its element reference ID from read_page or find tools. * `hover`: Move the mouse cursor to the specified coordinates or element without clicking. Useful for revealing tooltips, dropdown menus, or triggering hover states. */
      action: "left_click" | "right_click" | "type" | "screenshot" | "wait" | "scroll" | "key" | "left_click_drag" | "double_click" | "triple_click" | "zoom" | "scroll_to" | "hover"
      /** (x, y): The x (pixels from the left edge) and y (pixels from the top edge) coordinates. Required for `left_click`, `right_click`, `double_click`, `triple_click`, and `scroll`. For `left_click_drag`, this is the end position. */
      coordinate?: number[]
      /** The text to type (for `type` action) or the key(s) to press (for `key` action). For `key` action: Provide space-separated keys (e.g., "Backspace Backspace Delete"). Supports keyboard shortcuts using the platform's modifier key (use "cmd" on Mac, "ctrl" on Windows/Linux, e.g., "cmd+a" or "ctrl+a" for select all). Page zoom shortcuts (e.g. "cmd+=", "ctrl+-", "cmd+0") are not supported and will return an error - use the `zoom` action to magnify a region of the page instead. */
      text?: string
      /** The number of seconds to wait. Required for `wait`. Maximum 10 seconds. */
      duration?: number
      /** The direction to scroll. Required for `scroll`. */
      scroll_direction?: "up" | "down" | "left" | "right"
      /** The number of scroll wheel ticks. Optional for `scroll`, defaults to 3. */
      scroll_amount?: number
      /** (x, y): The starting coordinates for `left_click_drag`. */
      start_coordinate?: number[]
      /** (x0, y0, x1, y1): The rectangular region to capture for `zoom`. Coordinates define a rectangle from top-left (x0, y0) to bottom-right (x1, y1) in pixels from the viewport origin. Required for `zoom` action. Useful for inspecting small UI elements like icons, buttons, or text. */
      region?: number[]
      /** For `screenshot` and `zoom` only. Scale factor in [0.1, 1] for the returned image; 1 (default) uses the full image token budget, 0.5 returns an image at half the width and height (~quarter of the tokens). Coordinates are ALWAYS in the full-resolution coordinate frame (reported with every scaled screenshot), never in the scaled image's own pixels. Requires a Claude in Chrome extension version that supports scale; older extensions return the full-size image. */
      scale?: number
      /** Number of times to repeat the key sequence. Only applicable for `key` action. Must be a positive integer between 1 and 100. Default is 1. Useful for navigation tasks like pressing arrow keys multiple times. */
      repeat?: number
      /** Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Required for `scroll_to` action. Can be used as alternative to `coordinate` for click actions. */
      ref?: string
      /** Modifier keys for click actions. Supports: "ctrl", "shift", "alt", "cmd" (or "meta"), "win" (or "windows"). Can be combined with "+" (e.g., "ctrl+shift", "cmd+alt"). Optional. */
      modifiers?: string
      /** Tab ID to execute the action on. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
      /** For screenshot/zoom actions: save the image to disk so it can be attached to a message for the user. Returns the saved path in the tool result. Only set this when you intend to share the image — screenshots you're just looking at don't need saving. */
      save_to_disk?: boolean
      /** A few words saying what this action does on the page and to what, for example 'Sends the drafted reply to pat@example.com' or 'Opens the Filters menu'. Set it on every left_click, right_click, double_click, triple_click, left_click_drag, key and type action. State the effect only, and accurately: no reasons, nothing about what you were asked or allowed to do, no passwords or other secrets. */
      action_summary?: string
    }
    /** Upload one or multiple files to a file input element on the page. Do not click on file upload buttons or file inputs — clicking opens a native file picker dialog that you cannot see or interact with. Instead, use read_page or find to locate the file input element, then use this tool with its ref to upload files directly. Only files the user has shared with this session (attachments, the session's outputs/uploads folders, or folders the user has connected) can be uploaded; other paths will be rejected. The combined size of all files in a single call must stay under 10 MB. */
    "mcp__claude-in-chrome__file_upload": {
      /** Absolute paths to the files to upload. Each path must be a file the user has shared with this session. */
      paths: string[]
      /** Element reference ID of the file input from read_page or find tools (e.g., "ref_1", "ref_2"). */
      ref: string
      /** Tab ID where the file input is located. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
    }
    /** Find elements on the page using natural language. Can search for elements by their purpose (e.g., "search bar", "login button") or by text content (e.g., "organic mango product"). Returns up to 20 matching elements with references that can be used with other tools. If more than 20 matches exist, you'll be notified to use a more specific query. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__find": {
      /** Natural language description of what to find (e.g., "search bar", "add to cart button", "product title containing organic") */
      query: string
      /** Tab ID to search in. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
    }
    /** Set values in form elements using element reference ID from the read_page tool. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__form_input": {
      /** Element reference ID from the read_page tool (e.g., "ref_1", "ref_2") */
      ref: string
      /** The value to set. For checkboxes use boolean, for selects use option value or text, for other inputs use appropriate string/number */
      value: string | boolean | number
      /** Tab ID to set form value in. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
      /** A few words saying what this form fill does on the page and to what, for example 'Sets the delivery date to 29 September'. State the effect only, and accurately: no reasons, nothing about what you were asked or allowed to do, no passwords or other secrets. */
      action_summary?: string
    }
    /** Extract raw text content from the page, prioritizing article content. Ideal for reading articles, blog posts, or other text-heavy pages. Returns plain text without HTML formatting. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__get_page_text": {
      /** Tab ID to extract text from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
    }
    /** Manage GIF recording and export for browser automation sessions. Control when to start/stop recording browser actions (clicks, scrolls, navigation), then export as an animated GIF with visual overlays (click indicators, action labels, progress bar, watermark). All operations are scoped to the tab's group. When starting recording, take a screenshot immediately after to capture the initial state as the first frame. When stopping recording, take a screenshot immediately before to capture the final state as the last frame. For export, either provide 'coordinate' to drag/drop upload to a page element, or set 'download: true' to download the GIF. */
    "mcp__claude-in-chrome__gif_creator": {
      /** Action to perform: 'start_recording' (begin capturing), 'stop_recording' (stop capturing but keep frames), 'export' (generate and export GIF), 'clear' (discard frames) */
      action: "start_recording" | "stop_recording" | "export" | "clear"
      /** Tab ID to identify which tab group this operation applies to */
      tabId: number
      /** Always set this to true for the 'export' action only. This causes the gif to be downloaded in the browser. */
      download?: boolean
      /** Optional filename for exported GIF (default: 'recording-[timestamp].gif'). For 'export' action only. */
      filename?: string
      /** Optional GIF enhancement options for 'export' action. Properties: showClickIndicators (bool), showDragPaths (bool), showActionLabels (bool), showProgressBar (bool), showWatermark (bool), quality (number 1-30). All default to true except quality (default: 10). */
      options?: {
        /** Show orange circles at click locations (default: true) */
        showClickIndicators?: boolean
        /** Show red arrows for drag actions (default: true) */
        showDragPaths?: boolean
        /** Show black labels describing actions (default: true) */
        showActionLabels?: boolean
        /** Show orange progress bar at bottom (default: true) */
        showProgressBar?: boolean
        /** Show Claude logo watermark (default: true) */
        showWatermark?: boolean
        /** GIF compression quality, 1-30 (lower = better quality, slower encoding). Default: 10 */
        quality?: number
      }
    }
    /** Execute JavaScript code in the context of the current page. The code runs in the page's context and can interact with the DOM, window object, and page variables. Returns the result of the last expression or any thrown errors. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__javascript_tool": {
      /** Must be set to 'javascript_exec' */
      action: string
      /** The JavaScript code to execute. Evaluated in the page context with REPL semantics: top-level `await` works, and the result of the last expression is returned automatically — write the expression you want (e.g. `window.myData.value`, or `await fetch(url).then(r=>r.json())`) rather than `return ...`. You can access and modify the DOM, call page functions, and interact with page variables. */
      text: string
      /** Tab ID to execute the code in. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
    }
    /** List all Chrome browsers (extension instances) currently connected to this account. Returns each browser's deviceId, display name, OS platform, isLocal (its OS matches this computer's, a weak hint), when known onThisComputer (it is, or recently was, running on this computer), and inUse on the browser this session's actions go to when that is settled. When the user needs to choose a browser, use this to present the choices before select_browser. You do not need to call this before using the browser: when one browser is connected, or one was already chosen for this session, browser tools just work. Only if a browser tool reports that several browsers are connected and none is selected, or the user asks to change browsers, ask with the AskUserQuestion tool: one option per connected browser, the ones on this computer first (display name as the label, deviceId in parentheses), plus a final option labeled exactly: "Open a confirmation screen in every connected Chrome extension and let me select the right one there." Then call select_browser with the chosen deviceId, or switch_browser for the final option. Never pick one yourself. */
    "mcp__claude-in-chrome__list_connected_browsers": {}
    /** Navigate to a URL, or go forward/back in browser history. tabId may be omitted for URL navigation when calling navigate STANDALONE (not inside browser_batch): tabs_context_mcp{createIfEmpty:true} is called for you and the first tab in the session's group is navigated — its result is appended to this call's output so you have the tab list and ids for subsequent calls. Inside browser_batch, navigate (and other tools that act on a page) requires an explicit tabId. Pass an explicit tabId when you need a specific tab or when the session's group has multiple tabs whose state you must preserve. tabId is required for url:"back"/"forward". A tab opened for you this way is yours to clean up, the same as one from tabs_create_mcp: close it with tabs_close_mcp once you no longer need it and before finishing your task, unless the user asked to see it or wants it kept open. */
    "mcp__claude-in-chrome__navigate": {
      /** The URL to navigate to. Can be provided with or without protocol (defaults to https://). Use "forward" to go forward in history or "back" to go back in history. */
      url: string
      /** Tab ID to navigate. Must be a tab in the current group. If omitted for URL navigation when calling navigate standalone, tabs_context_mcp{createIfEmpty:true} is called for you. Required for url:"back"/"forward" and for navigate (and other tools that act on a page) inside browser_batch. */
      tabId?: number
    }
    /** Read browser console messages (console.log, console.error, console.warn, etc.) from a specific tab. Useful for debugging JavaScript errors, viewing application logs, or understanding what's happening in the browser console. Returns console messages from the current domain only. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. IMPORTANT: Always provide a pattern to filter messages - without a pattern, you may get too many irrelevant messages. */
    "mcp__claude-in-chrome__read_console_messages": {
      /** Tab ID to read console messages from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
      /** If true, only return error and exception messages. Default is false (return all message types). */
      onlyErrors?: boolean
      /** If true, clear the console messages after reading to avoid duplicates on subsequent calls. Default is false. */
      clear?: boolean
      /** Regex pattern to filter console messages. Only messages matching this pattern will be returned (e.g., 'error|warning' to find errors and warnings, 'MyApp' to filter app-specific logs). You should always provide a pattern to avoid getting too many irrelevant messages. */
      pattern?: string
      /** Maximum number of messages to return. Defaults to 100. Increase only if you need more results. */
      limit?: number
    }
    /** Read HTTP network requests (XHR, Fetch, documents, images, etc.) from a specific tab. Useful for debugging API calls, monitoring network activity, or understanding what requests a page is making. Returns all network requests made by the current page, including cross-origin requests. Requests are automatically cleared when the page navigates to a different domain. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__read_network_requests": {
      /** Tab ID to read network requests from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
      /** Optional URL pattern to filter requests. Only requests whose URL contains this string will be returned (e.g., '/api/' to filter API calls, 'example.com' to filter by domain). */
      urlPattern?: string
      /** If true, clear the network requests after reading to avoid duplicates on subsequent calls. Default is false. */
      clear?: boolean
      /** Maximum number of requests to return. Defaults to 100. Increase only if you need more results. */
      limit?: number
    }
    /** Get an accessibility tree representation of elements on the page. By default returns all elements including non-visible ones. Output is limited to 50000 characters by default. If the output exceeds this limit it is truncated at a line boundary, with a note giving the full size — pass a larger max_chars, or use depth/ref_id to focus on part of the page. Optionally filter for only interactive elements. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__read_page": {
      /** Filter elements: "interactive" for buttons/links/inputs only, "all" for all elements including non-visible ones (default: all elements) */
      filter?: "interactive" | "all"
      /** Tab ID to read from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
      /** Maximum depth of the tree to traverse (default: 15). Use a smaller depth if output is too large. */
      depth?: number
      /** Reference ID of a parent element to read. Will return the specified element and all its children. Use this to focus on a specific part of the page when output is too large. */
      ref_id?: string
      /** Maximum characters for output (default: 50000). Set to a higher value if your client can handle large outputs. */
      max_chars?: number
    }
    /** Resize the current browser window to specified dimensions. Useful for testing responsive designs or setting up specific screen sizes. If you don't have a valid tab ID, use tabs_context_mcp first to get available tabs. */
    "mcp__claude-in-chrome__resize_window": {
      /** Target window width in pixels */
      width: number
      /** Target window height in pixels */
      height: number
      /** Tab ID to get the window for. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
    }
    /** Select a specific Chrome browser by deviceId for browser automation, without broadcasting a pairing request. Use this after list_connected_browsers when the user has chosen one from the list. */
    "mcp__claude-in-chrome__select_browser": {
      /** The deviceId from list_connected_browsers. */
      deviceId: string
    }
    /** Execute a shortcut or workflow by running it in a new sidepanel window using the current tab (shortcuts and workflows are interchangeable). Use shortcuts_list first to see available shortcuts. This starts the execution and returns immediately - it does not wait for completion. */
    "mcp__claude-in-chrome__shortcuts_execute": {
      /** Tab ID to execute the shortcut on. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
      /** The ID of the shortcut to execute */
      shortcutId?: string
      /** The command name of the shortcut to execute (e.g., 'debug', 'summarize'). Do not include the leading slash. */
      command?: string
    }
    /** List all available shortcuts and workflows (shortcuts and workflows are interchangeable). Returns shortcuts with their commands, descriptions, and whether they are workflows. Use shortcuts_execute to run a shortcut or workflow. */
    "mcp__claude-in-chrome__shortcuts_list": {
      /** Tab ID to list shortcuts from. Must be a tab in the current group. Use tabs_context_mcp first if you don't have a valid tab ID. */
      tabId: number
    }
    /** Send a connection request to every Chrome browser with the extension installed and wait (up to 2 minutes) for the user to click 'Connect' in the one they want to use. The user can name the browser when they connect. Use this when the user wants to pick the browser themselves from inside Chrome rather than choosing from a list; otherwise prefer select_browser with a known deviceId. */
    "mcp__claude-in-chrome__switch_browser": {}
    /** Close a tab in the MCP tab group by its ID. Use to clean up tabs you're done with. Only tabs in this session's group are closable; call tabs_context_mcp first to get valid IDs. If you close the group's last tab, Chrome auto-removes the group — the next tabs_context_mcp with createIfEmpty starts fresh. */
    "mcp__claude-in-chrome__tabs_close_mcp": {
      /** The ID of the tab to close. Must be in this session's tab group. Get valid IDs from tabs_context_mcp. */
      tabId: number
    }
    /** Get context information about the current MCP tab group. Returns all tab IDs inside the group if it exists. CRITICAL: You must get the context at least once before using other browser automation tools so you know what tabs exist. Each new conversation should create its own new tab (using tabs_create_mcp) rather than reusing existing tabs, unless the user explicitly asks to use an existing tab. */
    "mcp__claude-in-chrome__tabs_context_mcp": {
      /** Creates a new MCP tab group if none exists, creates a new Window with a new tab group containing an empty tab (which can be used for this conversation). If a MCP tab group already exists, this parameter has no effect. */
      createIfEmpty?: boolean
    }
    /** Creates a new empty tab in the MCP tab group. CRITICAL: You must get the context using tabs_context_mcp at least once before using other browser automation tools so you know what tabs exist. Tabs you create are yours to clean up: close each one with tabs_close_mcp as soon as you no longer need it, and close any that remain before finishing your task. Leave a tab open only if the user asked to see it or wants it kept open. */
    "mcp__claude-in-chrome__tabs_create_mcp": {}
    /** Upload a screenshot you took with the computer tool's screenshot action to a file input or drag & drop target. Screenshot IDs expire a few minutes after capture, so take the screenshot of what you want to upload right before uploading. Don't reuse an ID that an upload already failed with: to retry, take a new screenshot of the same content, and retry that upload at most once (never after the user declined). This tool cannot upload user-attached images or other files; use file_upload with the file's path for those, if that tool is available. Supports two approaches: (1) ref - for targeting specific elements, especially hidden file inputs, (2) coordinate - for drag & drop to visible locations like Google Docs. Provide either ref or coordinate, not both. */
    "mcp__claude-in-chrome__upload_image": {
      /** ID of a screenshot from the computer tool's screenshot action, taken shortly before this call. IDs of user-attached images are not accepted. */
      imageId: string
      /** Element reference ID from read_page or find tools (e.g., "ref_1", "ref_2"). Use this for file inputs (especially hidden ones) or specific elements. Provide either ref or coordinate, not both. */
      ref?: string
      /** Viewport coordinates [x, y] for drag & drop to a visible location. Use this for drag & drop targets like Google Docs. Provide either ref or coordinate, not both. */
      coordinate?: number[]
      /** Tab ID where the target element is located. This is where the image will be uploaded to. */
      tabId: number
      /** Optional filename for the uploaded file (default: "image.png") */
      filename?: string
    }
    /** Clicks on the provided element */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__click": {
      /** The uid of an element on the page from the page content snapshot */
      uid: string
      /** Set to true for double clicks. Default is false. */
      dblClick?: boolean
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Closes the page by its index. The last open page cannot be closed. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__close_page": {
      /** The ID of the page to close. Call list_pages to list pages. */
      pageId: number
    }
    /** Drag an element onto another element */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__drag": {
      /** The uid of the element to drag */
      from_uid: string
      /** The uid of the element to drop into */
      to_uid: string
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Emulates various features on the selected page. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__emulate": {
      /** Throttle network. Omit to disable throttling. */
      networkConditions?: "Offline" | "Slow 3G" | "Fast 3G" | "Slow 4G" | "Fast 4G"
      /** Represents the CPU slowdown factor. Omit or set the rate to 1 to disable throttling */
      cpuThrottlingRate?: number
      /** Geolocation (`<latitude>,<longitude>`) to emulate. Latitude between -90 and 90. Longitude between -180 and 180. Omit to clear the geolocation override. */
      geolocation?: string
      /** User agent to emulate. Set to empty string to clear the user agent override. */
      userAgent?: string
      /** Emulate the dark or the light mode. Set to "auto" to reset to the default. */
      colorScheme?: "dark" | "light" | "auto"
      /** Emulate device viewports '<width>x<height>x<devicePixelRatio>[,mobile][,touch][,landscape]'. 'touch' and 'mobile' to emulate mobile devices. 'landscape' to emulate landscape mode. */
      viewport?: string
      /** Extra HTTP headers as a JSON string object, e.g. {"X-Custom": "value", "Authorization": "Bearer token"}. Headers are included into every HTTP request originating from the page and persist across navigations until cleared. Pass an empty string to clear all extra headers. */
      extraHttpHeaders?: string
    }
    /** Evaluate a JavaScript function inside the currently selected page. Returns the response as JSON, so returned values have to be JSON-serializable. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__evaluate_script": {
      /** A JavaScript function declaration to be executed by the tool in the currently selected page. Example without arguments: `() => document.title` or `async () => await fetch("example.com")`. Example with arguments: `(el) => el.innerText` */
      function: string
      /** An optional list of arguments to pass to the function. */
      args?: string[]
      /** The absolute or relative path to a file to save the script output to. If omitted, the output is returned inline. */
      filePath?: string
      /** Handle dialogs while execution. "accept", "dismiss", or string for response of window.prompt. Defaults to accept. */
      dialogAction?: string
    }
    /** Type text into an input, text area or select an option from a <select> element. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__fill": {
      /** The uid of an element on the page from the page content snapshot */
      uid: string
      /** The value to fill in. "true" or "false" for checkboxes and toggles, "true" for radio buttons. */
      value: string
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Fill out multiple form elements (inputs, selects, checkboxes, radios) at once. ALWAYS prefer this tool over multiple individual 'fill' or 'click' calls when interacting with forms. It is significantly faster, more reliable, and reduces turn count. Example: Fill username, password, and check "Remember Me" in one call. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__fill_form": {
      /** Elements from snapshot to fill out. */
      elements: Array<{
        /** The uid of the element to fill out */
        uid: string
        /** Value for the element. "true" or "false" for checkboxes and toggles, "true" for radio buttons. */
        value: string
      }>
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Gets a console message by its ID. You can get all messages by calling list_console_messages. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__get_console_message": {
      /** The msgid of a console message on the page from the listed console messages */
      msgid: number
    }
    /** Gets a network request by an optional reqid, if omitted returns the currently selected request in the DevTools Network panel. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__get_network_request": {
      /** The reqid of the network request. If omitted returns the currently selected request in the DevTools Network panel. */
      reqid?: number
      /** The absolute or relative path to a .network-request file to save the request body to. If omitted, the body is returned inline. */
      requestFilePath?: string
      /** The absolute or relative path to a .network-response file to save the response body to. If omitted, the body is returned inline. */
      responseFilePath?: string
    }
    /** If a browser dialog was opened, use this command to handle it */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__handle_dialog": {
      /** Whether to dismiss or accept the dialog */
      action: "accept" | "dismiss"
      /** Optional prompt text to enter into the dialog. */
      promptText?: string
    }
    /** Hover over the provided element */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__hover": {
      /** The uid of an element on the page from the page content snapshot */
      uid: string
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Get Lighthouse score and reports for accessibility, SEO, best practices, and agentic browsing. This excludes performance. For performance audits, run performance_start_trace */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit": {
      /** "navigation" reloads & audits. "snapshot" analyzes current state. */
      mode?: "navigation" | "snapshot"
      /** Device to emulate. */
      device?: "desktop" | "mobile"
      /** Directory for reports. If omitted, uses temporary files. */
      outputDirPath?: string
    }
    /** List all console messages for the currently selected page since the last navigation. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__list_console_messages": {
      /** Maximum number of messages to return. When omitted, returns all messages. */
      pageSize?: number
      /** Page number to return (0-based). When omitted, returns the first page. */
      pageIdx?: number
      /** Filter messages to only return messages of the specified resource types. When omitted or empty, returns all messages. */
      types?: Array<"log" | "debug" | "info" | "error" | "warn" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd" | "verbose" | "issue">
      /** Set to true to return the preserved messages over the last 3 navigations. */
      includePreservedMessages?: boolean
      /** Filter messages to only return messages of the specified service worker. */
      serviceWorkerId?: string
    }
    /** List all requests for the currently selected page since the last navigation. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__list_network_requests": {
      /** Maximum number of requests to return. When omitted, returns all requests. */
      pageSize?: number
      /** Page number to return (0-based). When omitted, returns the first page. */
      pageIdx?: number
      /** Filter requests to only return requests of the specified resource types. When omitted or empty, returns all requests. */
      resourceTypes?: Array<"document" | "stylesheet" | "image" | "media" | "font" | "script" | "texttrack" | "xhr" | "fetch" | "prefetch" | "eventsource" | "websocket" | "manifest" | "signedexchange" | "ping" | "cspviolationreport" | "preflight" | "fedcm" | "other">
      /** Set to true to return the preserved requests over the last 3 navigations. */
      includePreservedRequests?: boolean
    }
    /** Get a list of pages open in the browser. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__list_pages": {}
    /** Go to a URL, or back, forward, or reload. Use project URL if not specified otherwise. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page": {
      /** Navigate the page by URL, back or forward in history, or reload. */
      type?: "url" | "back" | "forward" | "reload"
      /** Target URL (only type=url) */
      url?: string
      /** Whether to ignore cache on reload. */
      ignoreCache?: boolean
      /** Whether to auto accept or beforeunload dialogs triggered by this navigation. Default is accept. */
      handleBeforeUnload?: "accept" | "dismiss"
      /** A JavaScript script to be executed on each new document before any other scripts for the next navigation. */
      initScript?: string
      /** Maximum wait time in milliseconds. If set to 0, the default timeout will be used. */
      timeout?: number
    }
    /** Open a new tab and load a URL. Use project URL if not specified otherwise. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__new_page": {
      /** URL to load in a new page. */
      url: string
      /** Whether to open the page in the background without bringing it to the front. Default is false (foreground). */
      background?: boolean
      /** If specified, the page is created in an isolated browser context with the given name. Pages in the same browser context share cookies and storage. Pages in different browser contexts are fully isolated. */
      isolatedContext?: string
      /** Maximum wait time in milliseconds. If set to 0, the default timeout will be used. */
      timeout?: number
    }
    /** Provides more detailed information on a specific Performance Insight of an insight set that was highlighted in the results of a trace recording. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_analyze_insight": {
      /** The id for the specific insight set. Only use the ids given in the "Available insight sets" list. */
      insightSetId: string
      /** The name of the Insight you want more information on. For example: "DocumentLatency" or "LCPBreakdown" */
      insightName: string
    }
    /** Start a performance trace on the selected webpage. Use to find frontend performance issues, Core Web Vitals (LCP, INP, CLS), and improve page load speed. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_start_trace": {
      /** Determines if, once tracing has started, the current selected page should be automatically reloaded. Navigate the page to the right URL using the navigate_page tool BEFORE starting the trace if reload or autoStop is set to true. */
      reload?: boolean
      /** Determines if the trace recording should be automatically stopped. */
      autoStop?: boolean
      /** The absolute file path, or a file path relative to the current working directory, to save the raw trace data. For example, trace.json.gz (compressed) or trace.json (uncompressed). */
      filePath?: string
    }
    /** Stop the active performance trace recording on the selected webpage. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_stop_trace": {
      /** The absolute file path, or a file path relative to the current working directory, to save the raw trace data. For example, trace.json.gz (compressed) or trace.json (uncompressed). */
      filePath?: string
    }
    /** Press a key or key combination. Use this when other input methods like fill() cannot be used (e.g., keyboard shortcuts, navigation keys, or special key combinations). */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__press_key": {
      /** A key or a combination (e.g., "Enter", "Control+A", "Control++", "Control+Shift+R"). Modifiers: Control, Shift, Alt, Meta */
      key: string
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Resizes the selected page's window so that the page has specified dimension */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__resize_page": {
      /** Page width */
      width: number
      /** Page height */
      height: number
    }
    /** Select a page as a context for future tool calls. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__select_page": {
      /** The ID of the page to select. Call list_pages to get available pages. */
      pageId: number
      /** Whether to focus the page and bring it to the top. */
      bringToFront?: boolean
    }
    /** Capture a heap snapshot of the currently selected page. Use to analyze the memory distribution of JavaScript objects and debug memory leaks. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_heapsnapshot": {
      /** A path to a .heapsnapshot file to save the heapsnapshot to. */
      filePath: string
    }
    /** Take a screenshot of the page or element. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot": {
      /** Type of format to save the screenshot as. Default is "png" */
      format?: "png" | "jpeg" | "webp"
      /** Compression quality for JPEG and WebP formats (0-100). Higher values mean better quality but larger file sizes. Ignored for PNG format. */
      quality?: number
      /** The uid of an element on the page from the page content snapshot. If omitted, takes a page screenshot. */
      uid?: string
      /** If set to true takes a screenshot of the full page instead of the currently visible viewport. Incompatible with uid. */
      fullPage?: boolean
      /** The absolute path, or a path relative to the current working directory, to save the screenshot to instead of attaching it to the response. */
      filePath?: string
    }
    /** Take a text snapshot of the currently selected page based on the a11y tree. The snapshot lists page elements along with a unique identifier (uid). Always use the latest snapshot. Prefer taking a snapshot over taking a screenshot. The snapshot indicates the element selected in the DevTools Elements panel (if any). */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_snapshot": {
      /** Whether to include all possible information available in the full a11y tree. Default is false. */
      verbose?: boolean
      /** The absolute path, or a path relative to the current working directory, to save the snapshot to instead of attaching it to the response. */
      filePath?: string
    }
    /** Type text using keyboard into a previously focused input */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__type_text": {
      /** The text to type */
      text: string
      /** Optional key to press after typing. E.g., "Enter", "Tab", "Escape" */
      submitKey?: string
    }
    /** Upload a file through a provided element. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__upload_file": {
      /** The uid of the file input element or an element that will open file chooser on the page from the page content snapshot */
      uid: string
      /** The local path of the file to upload */
      filePath: string
      /** Whether to include a snapshot in the response. Default is false. */
      includeSnapshot?: boolean
    }
    /** Wait for the specified text to appear on the selected page. */
    "mcp__plugin_chrome-devtools-mcp_chrome-devtools__wait_for": {
      /** Non-empty list of texts. Resolves when any value appears on the page. */
      text: string[]
      /** Maximum wait time in milliseconds. If set to 0, the default timeout will be used. */
      timeout?: number
    }
  }
}
