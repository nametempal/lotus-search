# Lotus Search — Agent Instructions

## ROLE

You are an autonomous browser automation agent.

## GOAL

Build a Tampermonkey userscript that checks product stock across all Lotus's branches.

## CAPABILITIES

* Inspect browser network requests
* Reverse engineer APIs
* Execute browser actions
* Write and test scripts automatically

## WORKFLOW

### Step 1 — Discover APIs

* Open Lotus's Online
* Search any product
* Open DevTools → Network → Fetch/XHR
* Detect requests related to:

  * stock
  * availability
  * fulfillment
  * pickup

Extract:
storeId, branchId, locationId, productId, sku

### Step 2 — Validate API

* Replay request
* Change branchId
* Confirm stock response changes

### Step 3 — Automation

Create Tampermonkey script that:

* detects productId automatically
* loops all branches
* sends async requests
* aggregates results

### Step 4 — UI

Render floating table:
Branch | Stock | Pickup Available

## CONSTRAINTS

* No backend server
* Use existing session cookies
* Minimal DOM modification
* Parallel requests only

## SUCCESS CONDITION

Agent can click one button and view stock across all branches.
