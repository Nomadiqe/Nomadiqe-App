import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <Settings className="w-8 h-8" />
            <span>Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and settings
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        defaultValue={session.user.name?.split(' ')[0] || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        defaultValue={session.user.name?.split(' ')[1] || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue={session.user.email || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      className="w-full rounded-md border border-input bg-background px-3 py-2 h-24 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Updates</h4>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional content</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <select className="rounded-md border border-input bg-background px-3 py-2">
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">Download your data</p>
                    </div>
                    <Button variant="outline">Export Data</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Billing & Payments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Payment Method</h4>
                      <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Billing History</h4>
                      <p className="text-sm text-muted-foreground">View past transactions</p>
                    </div>
                    <Button variant="outline">View History</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>App Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Language</h4>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                    <select className="rounded-md border border-input bg-background px-3 py-2">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Currency</h4>
                      <p className="text-sm text-muted-foreground">Display prices in your preferred currency</p>
                    </div>
                    <select className="rounded-md border border-input bg-background px-3 py-2">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Theme</h4>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Sun className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Moon className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}