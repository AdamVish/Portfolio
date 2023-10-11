VAR_INPUT
input_u0 : BOOL;
input_u1 : BOOL;
END_VAR

VAR_OUTPUT
output_y0 : REAL;
output_y1 : REAL;
output_y2 : REAL;
END_VAR

VAR
counter : REAL;
value : REAL;
K : REAL;
T : REAL;
dt : REAL;
sy : REAL;
setpoint : REAL;
min_limit : REAL;
END_VAR

FUNCTION init : INT;
counter := 0;
value := 0;
setpoint := 0;
K := 10; // Gain
T := 1.0; // Time constant
dt := 0.01; // Sample time, adjust accordingly to Time constant.
min_limit := 0;
init := 0;
END_FUNCTION

FUNCTION main : INT;

IF input_u0 THEN
    setpoint := 80;
    IF value <= setpoint THEN
        value := value + dt;

        // Euler Intergration formula.
        sy := (value*K/T) - (counter/T);
        counter := counter + (sy * dt);

        // Max limit of the water tank.
        IF counter > setpoint THEN
            counter := setpoint;
        END_IF;

        // Value limit so the incrementation won't overflow.
        IF value >= 8 THEN
            value := 8;
        END_IF;

    END_IF;
END_IF;

IF input_u1 THEN
    setpoint := 0;
    IF value >= setpoint THEN
        value := value - dt;

        sy := (value*K/T) - (counter/T);
        counter := counter + (sy * dt);

        IF counter < min_limit THEN
            counter := min_limit;
        END_IF;

        IF value <= 0 THEN
            value := 0;
        END_IF;

    END_IF;
END_IF;

output_y0 := counter;

// Monitoring the current values for debugging.
output_y1 := value;
output_y2 := sy;
main := 0;
END_FUNCTION

FUNCTION EXIT : INT;
EXIT := 0;
END_FUNCTION