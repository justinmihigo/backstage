// // Prevent multiple initialization (especially if Backstage uses worker threads)
// const { isMainThread } = require('node:worker_threads');
// if (!isMainThread) {
//   return;
// }

// const { NodeSDK } = require('@opentelemetry/sdk-node');
// const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// // Import OTLP exporters for traces and metrics
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
// const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// // Configure the exporters (assuming a local OTel collector or SigNoz endpoint)
// const traceExporter = new OTLPTraceExporter({
//   // e.g., sending to a collector running on localhost
//   url: 'http://localhost:4318/v1/traces'
// });
// const metricExporter = new OTLPMetricExporter({
//   url: 'http://localhost:4318/v1/metrics'
// });

// // Set up the OpenTelemetry Node SDK with auto-instrumentation
// const sdk = new NodeSDK({
//   traceExporter,// export traces via OTLP
//   metricReader: new PeriodicExportingMetricReader({ exporter: metricExporter }),  // export metrics via OTLP
//   instrumentations: [getNodeAutoInstrumentations()]
// });

// // Start the SDK (this registers global providers for traces/metrics)
// sdk.start();

// Prevent from running more than once (due to worker threads)
const { isMainThread } = require('node:worker_threads');

if (isMainThread) {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
  const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

  // By default exports the metrics on localhost:9464/metrics
  const prometheus = new PrometheusExporter();
  const sdk = new NodeSDK({
    // You can add a traceExporter field here too
    metricReader: prometheus,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}