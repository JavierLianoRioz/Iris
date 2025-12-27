-- Create table for tracking model latencies and performance metrics
CREATE TABLE IF NOT EXISTS metricas_modelos (
    model_id VARCHAR(255) PRIMARY KEY,
    latencia_ms INTEGER,
    num_muestras INTEGER DEFAULT 0,
    ultima_medicion TIMESTAMP,
    es_lento BOOLEAN DEFAULT FALSE
);
