#!/usr/bin/env node
"use strict";

/* Rewrites the repo snapshot (api/_lib/recommendations-snapshot.json) from a backup file
   downloaded from /admin ("Download backup"). Only the published entries are used, and only
   their public fields (the same ones the website shows): never an email, a private profile
   link or a token. Nothing is sent anywhere.
   Usage: dev\make-snapshot.bat "path\to\recommendations-backup-DATE.json"
   Node built-ins only. */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const { toPublic } = require(path.join(ROOT, "api", "_lib", "publicList"));
const { FORMAT } = require(path.join(ROOT, "api", "_lib", "snapshot"));
const BACKUP_FORMAT = "portfolio-recommendations-backup";
const MAX_FEATURED = 3;

const input = process.argv[2];
const output = process.argv[3] || path.join(ROOT, "api", "_lib", "recommendations-snapshot.json");

function fail(message) {
    console.error("Not written: " + message);
    process.exit(1);
}

if (!input) fail("give the path of the downloaded backup file.");
let backup;
try {
    backup = JSON.parse(fs.readFileSync(input, "utf8"));
} catch (e) {
    fail("could not read the backup file (" + e.message + ").");
}
if (!backup || backup.format !== BACKUP_FORMAT || backup.version !== 1 || !backup.entries || !Array.isArray(backup.entries.published)) {
    fail("this is not a recommendations backup this tool understands.");
}

const stamp = function (e) { return Date.parse(e.publishedAt || e.decidedAt || "") || 0; };
const published = backup.entries.published
    .filter(function (e) { return e && e.id && e.name && e.message; })
    .sort(function (a, b) { return stamp(b) - stamp(a); });
if (!published.length) fail("the backup has no published recommendations, so there is nothing to save.");

const entries = published.map(toPublic);
const featured = (backup.featured || [])
    .filter(function (id) { return entries.some(function (e) { return e.id === id; }); })
    .slice(0, MAX_FEATURED);

const snapshot = {
    format: FORMAT,
    version: 1,
    createdAt: new Date().toISOString(),
    source: { exportedAt: backup.exportedAt || null, environment: backup.environment || null },
    entries: entries,
    featured: featured
};
fs.writeFileSync(output, JSON.stringify(snapshot, null, 2) + "\n");

console.log("Snapshot written: " + entries.length + " recommendation(s), " + featured.length + " featured.");
console.log("File: " + output);
if (backup.environment && backup.environment !== "production") {
    console.log("WARNING: this backup came from '" + backup.environment + "', not production. Do not commit a snapshot made from test data.");
}
