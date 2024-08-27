import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Box } from "@mui/material";
import BottomNav from "@/components/bottom-navigation";
import { AppKit } from "../context/Web3modal";
import { CssBaseline } from "@mui/material";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proof Of Habit",
  description: "Habit Smart Contracts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: "white" }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                maxWidth: "390px", // iPhone 14 Pro width
                height: "844px", // iPhone 14 Pro height
                margin: "0 auto",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                <AppKit>{children}</AppKit>
              </Box>
              <BottomNav />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
