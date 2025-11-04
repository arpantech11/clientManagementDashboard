import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Users } from "lucide-react";
import { ClientCard } from "@/components/ClientCard";
import { ClientDialog } from "@/components/ClientDialog";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      company: "Tech Solutions Inc.",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      company: "Digital Ventures",
      phone: "+1 (555) 234-5678",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "m.chen@business.com",
      company: "Innovation Labs",
      phone: "+1 (555) 345-6789",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleAddClient = (client: Omit<Client, "id">) => {
    const newClient = {
      ...client,
      id: Date.now().toString(),
    };
    setClients([...clients, newClient]);
    toast({
      title: "Client added",
      description: `${client.name} has been added successfully.`,
    });
  };

  const handleEditClient = (client: Client) => {
    setClients(clients.map((c) => (c.id === client.id ? client : c)));
    toast({
      title: "Client updated",
      description: `${client.name} has been updated successfully.`,
    });
  };

  const handleDeleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    setClients(clients.filter((c) => c.id !== id));
    toast({
      title: "Client deleted",
      description: `${client?.name} has been removed.`,
    });
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-medium">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Client Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your clients efficiently</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 transition-smooth hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 transition-smooth focus:shadow-soft"
            />
          </div>
          <Button
            onClick={openAddDialog}
            className="gap-2 h-11 px-6 gradient-hero hover:opacity-90 transition-smooth shadow-medium group w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-smooth" />
            Add New Client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft border border-border transition-smooth hover:shadow-medium">
            <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
            <p className="text-3xl font-bold text-primary mt-2">{clients.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-border transition-smooth hover:shadow-medium">
            <p className="text-sm font-medium text-muted-foreground">Active Today</p>
            <p className="text-3xl font-bold text-primary mt-2">{Math.floor(clients.length * 0.6)}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-border transition-smooth hover:shadow-medium">
            <p className="text-sm font-medium text-muted-foreground">New This Week</p>
            <p className="text-3xl font-bold text-primary mt-2">{Math.floor(clients.length * 0.3)}</p>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={openEditDialog}
              onDelete={handleDeleteClient}
            />
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No clients found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first client"}
            </p>
          </div>
        )}
      </main>

      {/* Client Dialog */}
      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={editingClient}
        onSave={editingClient ? handleEditClient : handleAddClient}
      />
    </div>
  );
};

export default Dashboard;
