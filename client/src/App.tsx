import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import Support from "@/pages/support";
import Pricing from "@/pages/pricing";
import ForBusiness from "@/pages/for-business";
import SubscriptionManage from "@/pages/merchant/subscription/index";
import SubscriptionSuccess from "@/pages/merchant/subscription/success";
import SubscriptionCancel from "@/pages/merchant/subscription/cancel";
import MerchantLogin from "@/pages/merchant/login";
import MerchantDashboard from "@/pages/merchant/dashboard";
import Explore from "@/pages/explore";
import CityDetail from "@/pages/city";
import PlaceDetail from "@/pages/place";
import ForBusinessPricing from "@/pages/for-business/pricing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/support" component={Support} />
      <Route path="/for-business" component={ForBusiness} />
      <Route path="/for-business/pricing" component={ForBusinessPricing} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/merchant/login" component={MerchantLogin} />
      <Route path="/merchant/dashboard" component={MerchantDashboard} />
      <Route path="/merchant/subscription" component={SubscriptionManage} />
      <Route path="/merchant/subscription/success" component={SubscriptionSuccess} />
      <Route path="/merchant/subscription/cancel" component={SubscriptionCancel} />
      <Route path="/explore" component={Explore} />
      <Route path="/city/:slug" component={CityDetail} />
      <Route path="/place/:id" component={PlaceDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
