# Test Plan

## Unit

-   Metrics Analyzer
-   Recommendation Engine
-   Workout validation
-   Level compiler

## Integration

-   Pose events -\> gameplay
-   Session metrics -\> AI Coach

## End-to-End

-   Home -\> Workout -\> Calibration -\> Gameplay -\> Mission Complete
    -\> Coach

## Performance

-   60 FPS gameplay target
-   No React rerender on every pose frame
