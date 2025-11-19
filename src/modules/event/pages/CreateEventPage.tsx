import Layout from "../../../shared/components/Layout";
import CreateEventWizard from "./create/CreateEventWizard";

export default function CreateEventPage() {
  return (
    <Layout>
      <div style={{ padding: 40 }}>        
        <CreateEventWizard />
      </div>
    </Layout>
  );
}
