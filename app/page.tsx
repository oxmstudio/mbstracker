"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Download, RefreshCw, Plus, Minus, Upload } from "lucide-react";

const CADENCE_PRESETS = {
  weekly: { label: "Weekly", count: 7, step: "day" },
  monthly: { label: "Monthly", count: 31, step: "day" },
  quarterly: { label: "Quarterly", count: 13, step: "week" },
  yearly: { label: "Yearly", count: 12, step: "month" },
} as const;

const LOGIC_PRESETS = {
  mastertech_standard: {
    name: "Mastertech Standard",
    flatTolerancePct: 1.5,
    steepRisePct: 14,
    steepDropPct: -14,
    powerBandPct: 92,
    powerStabilityPct: 4,
    dangerRunLength: 2,
    powerChangePct: 9,
    nonExistenceFloorOffset: 0,
  },
  mastertech_strict: {
    name: "Mastertech Strict",
    flatTolerancePct: 1,
    steepRisePct: 12,
    steepDropPct: -12,
    powerBandPct: 94,
    powerStabilityPct: 3,
    dangerRunLength: 2,
    powerChangePct: 8,
    nonExistenceFloorOffset: 0,
  },
  mastertech_loose: {
    name: "Mastertech Loose",
    flatTolerancePct: 2.5,
    steepRisePct: 18,
    steepDropPct: -18,
    powerBandPct: 89,
    powerStabilityPct: 6,
    dangerRunLength: 3,
    powerChangePct: 11,
    nonExistenceFloorOffset: 0,
  },
} as const;

const RED_CONDITIONS = new Set(["Emergency", "Danger", "Non-Existence"]);
const DEFAULT_START_DATE = new Date().toISOString().slice(0, 10);

const SAMPLE_VALUES = {
  weekly: [12000, 13800, 12600, 14250, 16100, 15400, 16800],
  monthly: [12000, 12200, 12500, 12900, 13500, 13100, 13800, 14500, 14900, 14200, 14700, 15400, 16000, 16600, 16200, 15900, 16400, 17000, 17300, 17600, 17100, 16800, 17400, 18100, 18500, 17900, 18300, 19000, 19400, 18800, 19800],
  quarterly: [12000, 12800, 12400, 13200, 14100, 13800, 14900, 15700, 15300, 16400, 17100, 16700, 17800],
  yearly: [12000, 13800, 12600, 14250, 16100, 15400, 16800, 17600, 17000, 18500, 19400, 20500],
};

type CadenceKey = keyof typeof CADENCE_PRESETS;
type LogicPresetKey = keyof typeof LOGIC_PRESETS;

type ImportedRow = {
  date?: string;
}
