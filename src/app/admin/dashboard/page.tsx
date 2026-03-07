export default function AdminDashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-background border rounded-xl shadow-sm">
        <h3 className="text-muted-foreground text-sm font-medium">
          Total Projects
        </h3>
        <p className="text-3xl font-bold mt-2">12</p>
      </div>
      <div className="p-6 bg-background border rounded-xl shadow-sm">
        <h3 className="text-muted-foreground text-sm font-medium">
          New Enquiries
        </h3>
        <p className="text-3xl font-bold mt-2">5</p>
      </div>
      <div className="p-6 bg-background border rounded-xl shadow-sm">
        <h3 className="text-muted-foreground text-sm font-medium">
          Blog Posts
        </h3>
        <p className="text-3xl font-bold mt-2">8</p>
      </div>

      <div className="md:col-span-3 p-6 bg-background border rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <p className="text-muted-foreground italic">
          Coming soon: Activity feed will be shown here.
        </p>
      </div>
    </div>
  );
}
