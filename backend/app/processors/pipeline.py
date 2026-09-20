"""
Ties preprocessing + metrics + enhancement operations together into two
simple, reusable pipeline functions used by the service layer.
"""

from __future__ import annotations

import time
from typing import Any, Dict, List, Tuple

import numpy as np

from app.processors.preprocessing import resize_for_analysis
from app.utils.image_utils import (
    apply_operations,
    compute_all_metrics,
    detect_issues,
    recommend_operations,
)


def run_diagnosis_pipeline(bgr: np.ndarray) -> Dict[str, Any]:
    """
    Full diagnosis pipeline: preprocess -> compute metrics -> detect issues.
    Returns a dict ready to persist as a Diagnosis row.
    """
    analysis_img = resize_for_analysis(bgr)
    metrics = compute_all_metrics(analysis_img)
    issues = detect_issues(metrics)

    return {
        "blur_score": metrics["blur_score"],
        "noise_score": metrics["noise_score"],
        "exposure_score": metrics["exposure_score"],
        "contrast_score": metrics["contrast_score"],
        "color_score": metrics["color_score"],
        "compression_score": metrics["compression_score"],
        "overall_quality_score": metrics["overall_quality_score"],
        "issues": issues,
        "metrics_raw": metrics["raw"],
    }


def run_enhancement_pipeline(
    bgr: np.ndarray, operations: List[str] | None, diagnosis_metrics: Dict[str, Any] | None
) -> Tuple[np.ndarray, List[str], float]:
    """
    Full enhancement pipeline: decide operations (if not explicitly given) ->
    apply them -> return the enhanced image, the operations actually used,
    and the processing time in milliseconds.
    """
    start = time.perf_counter()

    if not operations:
        if diagnosis_metrics:
            operations = recommend_operations(diagnosis_metrics)
        else:
            operations = ["contrast", "sharpen"]

    enhanced = apply_operations(bgr, operations)
    elapsed_ms = (time.perf_counter() - start) * 1000
    return enhanced, operations, elapsed_ms


def verify_improvement(quality_before: float, quality_after: float) -> float:
    """Percentage improvement in overall quality score (can be negative)."""
    if quality_before <= 0:
        return 0.0
    return round((quality_after - quality_before) / quality_before * 100, 2)
