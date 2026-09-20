\# LEARNING.md — AI Student Life Mentor



What we actually learned building this over four days, in the order it happened.

Kept honest on purpose — the mistakes are as useful as the wins.



\---



\## Day 1 — Setup



\- First time provisioning AWS from scratch for a real project: IAM users, access

&#x20; keys, and `aws configure` instead of using the console for everything. Learned

&#x20; the hard way that a brand-new IAM user has \*\*zero permissions by default\*\* —

&#x20; our first `dynamodb create-table` call failed with `AccessDeniedException`

&#x20; even though the user existed and credentials were valid. Fixed by explicitly

&#x20; attaching `AdministratorAccess` (appropriate for a hackathon timeline; would

&#x20; scope this down for a real production system).



\- Learned that DynamoDB's `PAY\_PER\_REQUEST` billing mode means no capacity

&#x20; planning at all for a project this size — genuinely free at demo volume, and

&#x20; one less thing to think about under time pressure.



\---



\## Day 1–2 — The Bedrock access saga



This ate the better part of a night and is probably our single biggest lesson.



\- Discovered Bedrock actually has \*\*two separate endpoint generations\*\* for

&#x20; Anthropic models: the classic `bedrock-runtime` (IAM-signed, accessed via

&#x20; `@aws-sdk/client-bedrock-runtime`) and a newer `bedrock-mantle` endpoint

&#x20; (project-scoped, accessed via `@anthropic-ai/bedrock-sdk`, uses the standard

&#x20; Anthropic Messages API shape). Model access grants and quotas are \*\*not

&#x20; shared between the two\*\* — being listed as `ACTIVE` in

&#x20; `list-foundation-models` does not mean your account can actually invoke it.



\- Learned that some Bedrock models require an \*\*inference profile ID\*\* (with a

&#x20; region prefix like `us.`) rather than the bare model ID for on-demand

&#x20; invocation — calling with the bare ID returns a generic

&#x20; `ValidationException: Operation not allowed` that gives no hint this is the

&#x20; actual cause.



\- Eventually got a specific, unambiguous answer by testing directly in

&#x20; Bedrock's own Workbench UI rather than through code: a clean

&#x20; `403 permission\_error: <model> is not available for this account`. This was

&#x20; the most useful error of the whole night — specific, reproducible, and

&#x20; confirmed the same failure happened for two different Claude models

&#x20; (Sonnet 5 and Opus 5), which told us it was an account-level restriction, not

&#x20; a model-specific one or a bug in our code.



\- \*\*Decision:\*\* rather than keep burning hours chasing AWS Sales / mentor

&#x20; escalation with the clock running, we pivoted to a local Ollama model

&#x20; (Llama 3.1) run through the Strands Agent framework, exposed to the internet

&#x20; via an ngrok tunnel, so the demo could keep moving. This is the single

&#x20; biggest architecture change from the original plan, and we're saying so

&#x20; plainly rather than quietly implying it's Bedrock.



\---



\## Day 2–3 — The bug that looked like success



\- The most important catch of the whole project: our FastAPI backend's

&#x20; `/profile` endpoint returned a perfect `200` with a fully-formed profile

&#x20; object every single time — which made it \*look\* completely done. It wasn't.

&#x20; `get\_profile`/`save\_profile` were reading and writing a local `profiles.json`

&#x20; file on disk, a placeholder left over from early scaffolding, never actually

&#x20; connected to DynamoDB.



\- \*\*The API response alone was not proof of anything.\*\* We only caught this by

&#x20; independently checking DynamoDB directly with

&#x20; `aws dynamodb get-item` / `aws dynamodb scan` after every write, rather than

&#x20; trusting that a 200 response meant the data existed somewhere durable. Once

&#x20; caught, the fix was small — swap two functions to real `boto3` calls

&#x20; (`table.get\_item` / `table.put\_item`) — but it would have completely

&#x20; undermined the "the mentor remembers" pitch if it had shipped unnoticed,

&#x20; since nothing would have survived a server restart.



\- Lesson for next time: \*\*verify persistence at the database layer, not the

&#x20; API layer\*\*, especially when a placeholder was ever written "temporarily."



\---



\## Day 3–4 — Infrastructure reliability



\- Learned that a laptop-hosted backend behind an ngrok free-tier tunnel is

&#x20; fragile in a way a judge can't see until it's too late: the tunnel silently

&#x20; dropped after the laptop went to sleep, twice, with no obvious warning

&#x20; beyond a generic `ERR\_NGROK\_3200` on the frontend. Fixed by disabling

&#x20; sleep/screen-lock entirely (`powercfg /change standby-timeout-ac 0`) for the

&#x20; remainder of the event, and by always verifying with a direct `curl` against

&#x20; both `localhost` and the public tunnel URL before assuming anything is

&#x20; "live" — two independent checks, not one.



\- Learned that Windows PowerShell aliases `curl` to `Invoke-WebRequest`, which

&#x20; uses different flag syntax (`-Headers @{}` instead of `-H "key: value"`) —

&#x20; cost real time until we started using `curl.exe` explicitly to get real curl

&#x20; behavior.



\- ngrok's free tier shows an interstitial "you're about to visit this tunnel"

&#x20; warning page to any request that looks like it's coming from a browser —

&#x20; which silently breaks JSON API calls unless every request explicitly sends

&#x20; the `ngrok-skip-browser-warning: true` header. Easy to miss because the

&#x20; failure mode looks like "nothing is returned" rather than a clear error.



\---



\## What we'd do differently with more time



\- Would test Bedrock access with a direct Workbench prompt \*before\* writing

&#x20; any integration code — it's the fastest, most unambiguous way to confirm

&#x20; account-level access, faster than debugging through an SDK.

\- Would write a small automated check that verifies data actually lands in

&#x20; DynamoDB after every write during development, rather than relying on

&#x20; manual `get-item` checks caught only because we happened to look.

\- Would move the backend to a real always-on host (even a free-tier cloud VM)

&#x20; earlier, rather than depending on a personal laptop staying awake through

&#x20; the whole event.

