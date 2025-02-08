import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api/": {
          target: "https://blog-app-sigma-neon.vercel.app",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        },
      },
      https: false,
    },
    build: {
      sourcemap: env.NODE_ENV !== "production",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            daisyui: ["daisyui"],
          },
        },
      },
    },
    plugins: [react()],
  };
});
