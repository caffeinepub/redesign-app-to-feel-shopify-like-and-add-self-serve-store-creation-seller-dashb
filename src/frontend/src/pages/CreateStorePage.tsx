import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Store, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetCallerSupplierProfile, useRegisterSupplier, useUpdateExistingSupplier } from '../hooks/useQueries';

export default function CreateStorePage() {
  const navigate = useNavigate();
  const { data: supplierProfile, isLoading } = useGetCallerSupplierProfile();
  const registerSupplier = useRegisterSupplier();
  const updateSupplier = useUpdateExistingSupplier();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactInfo: '',
  });

  const isEditing = !!supplierProfile;

  useEffect(() => {
    if (supplierProfile) {
      setFormData({
        name: supplierProfile.name,
        description: supplierProfile.description,
        contactInfo: supplierProfile.contactInfo,
      });
    }
  }, [supplierProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Store name is required');
      return;
    }

    try {
      if (isEditing) {
        await updateSupplier.mutateAsync(formData);
        toast.success('Store updated successfully!');
      } else {
        await registerSupplier.mutateAsync(formData);
        toast.success('Store created successfully!');
      }
      navigate({ to: '/seller-dashboard' });
    } catch (error) {
      console.error('Store operation error:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} store`);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          {isEditing ? 'Update Your Store' : 'Create Your Store'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isEditing 
            ? 'Update your store information and settings' 
            : 'Set up your online store and start selling products'}
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Provide details about your store to help customers find and trust you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Store"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your store and what makes it special..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Input
                id="contactInfo"
                type="email"
                placeholder="contact@mystore.com"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={registerSupplier.isPending || updateSupplier.isPending}
                className="flex-1 gap-2"
              >
                {registerSupplier.isPending || updateSupplier.isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {isEditing ? 'Update Store' : 'Create Store'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
