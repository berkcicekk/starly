'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Users,
  Filter,
  Search,
  Star,
  Eye,
  ArrowRight,
  Coins,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/stellar';
import Link from 'next/link';

// Mock marketplace data
const marketplaceAssets = [
  {
    id: '1',
    name: 'MoneyGram',
    location: 'Stellar Network',
    type: 'real_estate',
    description: 'With thousands of retail locations worldwide, MoneyGram lets you convert your cash into USDC, and back again.',
    totalValue: '2500000',
    availableTokens: '1000000',
    pricePerToken: '2.50',
    projectedYield: '8.5',
    riskLevel: 'low' as const,
    status: 'live' as const,
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() - 86400000,
    investors: 45,
    contractId: 'CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6'
  },
  {
    id: '2',
    name: 'Franklin Templeton',
    location: 'Stellar Network',
    type: 'real_estate',
    description: 'Class A commercial office space in downtown Chicago',
    totalValue: '5000000',
    availableTokens: '2000000',
    pricePerToken: '2.50',
    projectedYield: '9.2',
    riskLevel: 'medium' as const,
    status: 'upcoming' as const,
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() + 2592000000, // 30 days from now
    investors: 0,
    contractId: null
  },
  {
    id: '3',
    name: 'Circle',
    location: 'Delaware, USA',
    type: 'commodities',
    description: 'Make money movement your competitive edge.',
    totalValue: '3000000',
    availableTokens: '1500000',
    pricePerToken: '2.00',
    projectedYield: '6.8',
    riskLevel: 'low' as const,
    status: 'upcoming' as const,
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() + 5184000000, // 60 days from now
    investors: 0,
    contractId: null
  },
  {
    id: '4',
    name: 'Renewable Energy Farm',
    location: 'Texas, USA',
    type: 'infrastructure',
    description: 'Solar energy farm with long-term government contracts',
    totalValue: '8000000',
    availableTokens: '4000000',
    pricePerToken: '2.00',
    projectedYield: '7.5',
    riskLevel: 'medium' as const,
    status: 'upcoming' as const,
    images: ['/api/placeholder/400/300'],
    launchDate: Date.now() + 7776000000, // 90 days from now
    investors: 0,
    contractId: null
  }
];

export default function MarketplacePage() {
  const { isConnected } = useWalletStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const assetTypes = [
    { value: 'all', label: 'All Assets' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'infrastructure', label: 'Infrastructure' }
  ];

  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'live', label: 'Live' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'sold_out', label: 'Sold Out' }
  ];

  const filteredAssets = marketplaceAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'live': return 'default';
      case 'upcoming': return 'secondary';
      case 'sold_out': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Task List</h1>
            <p className="text-xl text-muted-foreground">
            Discover on-chain tasks, stake tokens, and start earning rewards on Stellar today.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Task</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketplaceAssets.length}</div>
                <p className="text-xs text-muted-foreground">Across multiple sectors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    marketplaceAssets.reduce((sum, asset) => sum + parseFloat(asset.totalValue), 0).toString()
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Available for investment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.0%</div>
                <p className="text-xs text-muted-foreground">Annual projected return</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketplaceAssets.reduce((sum, asset) => sum + asset.investors, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Verified participants</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search project by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {assetTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>

                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {statusTypes.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant={getStatusBadgeVariant(asset.status)}>
                      {asset.status.toUpperCase()}
                    </Badge>
                    <Badge variant={getRiskBadgeVariant(asset.riskLevel)}>
                      {asset.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{asset.name}</h3>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {asset.location}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {asset.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="font-semibold">{formatCurrency(asset.totalValue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min. Prize</p>
                      <p className="font-semibold">{formatCurrency((parseFloat(asset.pricePerToken) * 100).toString())}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Projected Yield</p>
                      <p className="font-semibold text-green-600">{formatPercentage(asset.projectedYield)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Investors</p>
                      <p className="font-semibold">{asset.investors}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Available Tokens</span>
                      <span>{(parseFloat(asset.availableTokens) / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${asset.status === 'live' ? Math.random() * 40 + 20 : 0}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {asset.status === 'live' && asset.contractId ? (
                      <Button className="flex-1" asChild>
                        <Link href="/transfer">
                          Invest Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="outline" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        {asset.status === 'upcoming' ? `Task Time: ${formatDate(asset.launchDate)}` : 'Sold Out'}
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all available assets.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedStatus('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Investing?</h2>
              <p className="text-lg opacity-90 mb-6">
                Join hundreds of investors building wealth through tokenized real world assets
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isConnected ? (
                  <Button size="lg" variant="secondary">
                    <Shield className="h-5 w-5 mr-2" />
                    Connect Wallet to Start
                  </Button>
                ) : (
                  <>
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/transfer">
                        <Coins className="h-5 w-5 mr-2" />
                        Start Investing
                      </Link>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                      <Link href="/tokenize">
                        <Building2 className="h-5 w-5 mr-2" />
                        Tokenize Asset
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 