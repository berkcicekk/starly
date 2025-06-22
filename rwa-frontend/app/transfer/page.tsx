'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Info,
  Wallet
} from 'lucide-react';
import { formatTokenAmount, isValidStellarAddress, toContractAmount, estimateNetworkFee } from '@/lib/stellar';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ClaimPage() {
  const { isConnected, address, connect } = useWalletStore();
  const { 
    userBalance, 
    isWhitelisted, 
    compliance,
    Claim,
    isLoading,
    fetchUserData,
    fetchContractData
  } = useContractStore();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [recipientCompliance, setRecipientCompliance] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load data on mount and when wallet connects
  useEffect(() => {
    fetchContractData();
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchContractData, fetchUserData]);

  
  useEffect(() => {
    if (recipient) {
      const valid = isValidStellarAddress(recipient);
      setIsValidRecipient(valid);
      
      if (valid) {
      
        setRecipientCompliance({
          isWhitelisted: true,
          kyc_verified: true,
          jurisdiction: 'US'
        });
      } else {
        setRecipientCompliance(null);
      }
    } else {
      setIsValidRecipient(false);
      setRecipientCompliance(null);
    }
  }, [recipient]);

  const handleMaxAmount = () => {
    setAmount(formatTokenAmount(userBalance));
  };

  const canClaim = () => {
    if (!isConnected || !address) return false;
    if (!isWhitelisted) return false;
    if (!isValidRecipient) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (parseFloat(amount) > parseFloat(formatTokenAmount(userBalance))) return false;
    return true;
  };

  const handleClaim = async () => {
    if (!canClaim() || !address) return;

    try {
      const contractAmount = toContractAmount(amount);
      const success = await Claim(address, recipient, contractAmount);
      
      if (success) {
        toast.success('Claim completed successfully!');
        setAmount('');
        setRecipient('');
        setShowConfirmation(false);
      } else {
        toast.error('Claim failed. Please try again.');
      }
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Claim failed. Please check the details and try again.');
    }
  };

  if (!isConnected) {
    return (
     <div className="min-h-screen bg-black text-white">

        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-6">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  You need to connect your Freighter wallet to Claim RWA tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connect} className="w-full">
                  Connect Freighter Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Claim RWA Tokens</h1>
            <p className="text-muted-foreground">
              Send your tokenized real world asset shares to other verified investors
            </p>
          </div>

          {/* Compliance Status */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  Your compliance status: {' '}
                  <Badge variant={isWhitelisted ? 'default' : 'destructive'}>
                    {isWhitelisted ? 'Verified' : 'Not Verified'}
                  </Badge>
                </span>
                {compliance?.kyc_verified && (
                  <Badge variant="outline" className="text-xs">
                    KYC Complete
                  </Badge>
                )}
              </div>
            </AlertDescription>
          </Alert>

            {/* Current Holdings */}
            <Card
            style={{
              borderWidth: 4,
              borderRadius: 8,
              borderStyle: 'solid',
              borderImage: 'linear-gradient(90deg, #3b82f6, #a21caf, #ec4899) 1',
            }}
            >
            <CardHeader>
              <CardTitle>Your Earns</CardTitle>
              <CardDescription>Available tokens for Claim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatTokenAmount(userBalance)} XLM</p>
                <p className="text-sm text-muted-foreground">MoneyGram tokens</p>
              </div>
              <Badge variant="secondary">X thread task</Badge>
              </div>
            </CardContent>
            </Card>
            {/* Claim Form */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Claim Tokens
              </CardTitle>
              <CardDescription>
                Enter the recipient address and amount to Claim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Address */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="G... (Stellar address)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className={`font-mono ${
                    recipient && !isValidRecipient ? 'border-red-500' : ''
                  }`}
                />
                {recipient && !isValidRecipient && (
                  <p className="text-sm text-red-600">Invalid Stellar address format</p>
                )}
                {isValidRecipient && recipientCompliance && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Recipient is verified and whitelisted
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount (XLM)</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMaxAmount}
                    className="text-xs"
                  >
                    Max: {formatTokenAmount(userBalance)}
                  </Button>
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                {amount && parseFloat(amount) > parseFloat(formatTokenAmount(userBalance)) && (
                  <p className="text-sm text-red-600">Insufficient balance</p>
                )}
              </div>

              {/* Transaction Details */}
              {amount && isValidRecipient && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Transaction Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-mono">{amount} XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Network Fee:</span>
                      <span className="font-mono">{estimateNetworkFee('Claim')} XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span className="font-mono text-xs">
                        {recipient.slice(0, 8)}...{recipient.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim Button */}
              <Button 
                onClick={handleClaim}
                disabled={!canClaim() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  'Processing Claim...'
                ) : (
                  <>
                    Claim Tokens
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Warnings */}
              {!isWhitelisted && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your address is not whitelisted. You cannot Claim tokens until compliance verification is complete.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Claim Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">KYC Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Both sender and recipient must have completed KYC verification
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Whitelist Status</p>
                  <p className="text-sm text-muted-foreground">
                    Addresses must be on the approved whitelist for this asset
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Jurisdiction Compliance</p>
                  <p className="text-sm text-muted-foreground">
                    Claims must comply with local regulations and asset restrictions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">
                ← Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 