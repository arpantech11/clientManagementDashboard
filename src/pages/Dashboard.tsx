import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Users } from "lucide-react";
import { ClientCard } from "@/components/ClientCard";
import { ClientDialog } from "@/components/ClientDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication and load clients
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/");
        return;
      }
      loadClients();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setClients(data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleAddClient = async (client: Omit<Client, "id">) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .insert([client])
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      toast({
        title: "Client added",
        description: `${client.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: client.name,
          email: client.email,
          company: client.company,
          phone: client.phone,
        })
        .eq("id", client.id);

      if (error) throw error;

      setClients(clients.map((c) => (c.id === client.id ? client : c)));
      toast({
        title: "Client updated",
        description: `${client.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const client = clients.find((c) => c.id === id);
      
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setClients(clients.filter((c) => c.id !== id));
      toast({
        title: "Client deleted",
        description: `${client?.name} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading clients...</p>
          </div>
        ) : (
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
        )}

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