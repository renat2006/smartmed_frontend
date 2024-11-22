import {PatientLog} from "@/pages/PatientLog.tsx";
import {ThemeProvider} from "@/components/theme-provider/theme-provider.tsx";

function App() {


  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
<PatientLog/>
      </ThemeProvider>
  )
}

export default App
