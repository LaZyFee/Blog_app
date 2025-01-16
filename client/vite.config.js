import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api/": {
          target: env.VITE_API_BASE_URL || "http://localhost:5000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        },
      },
      https: false,
    },
    build: {
      sourcemap: env.NODE_ENV !== "production",
      chunkSizeWarningLimit: 1000, // Increase chunk size limit to 1MB
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"], // Split React libraries
            daisyui: ["daisyui"], // Split DaisyUI into its own chunk
          },
        },
      },
    },
    plugins: [react()],
  };
});
