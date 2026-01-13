'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantApi, type ClaimablePlace } from '@/services/api/merchant';
import { PlaceCard } from './PlaceCard';

interface PlaceClaimModalProps {
  onSuccess?: () => void;
  maxPlaces?: number;
  currentPlacesCount?: number;
}

const categories = [
  '餐廳',
  '咖啡廳',
  '景點',
  '住宿',
  '購物',
  '交通',
  '其他',
];

export function PlaceClaimModal({
  onSuccess,
  maxPlaces = 1,
  currentPlacesCount = 0,
}: PlaceClaimModalProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [showNewPlaceForm, setShowNewPlaceForm] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    city: '',
    district: '',
    category: '',
  });

  const queryClient = useQueryClient();

  const canAddMore = currentPlacesCount < maxPlaces;

  // 搜尋可認領的景點
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['searchPlaces', activeSearch],
    queryFn: () => merchantApi.searchPlaces(activeSearch),
    enabled: activeSearch.length >= 2,
  });

  // 認領景點
  const claimMutation = useMutation({
    mutationFn: (placeId: number) => merchantApi.claimPlace(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantPlaces'] });
      onSuccess?.();
      setOpen(false);
    },
  });

  // 新增自有景點
  const createMutation = useMutation({
    mutationFn: () => merchantApi.createPlace(newPlace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantPlaces'] });
      onSuccess?.();
      setOpen(false);
      setNewPlace({ name: '', address: '', city: '', district: '', category: '' });
      setShowNewPlaceForm(false);
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      setActiveSearch(searchQuery.trim());
      setShowNewPlaceForm(false);
    }
  };

  const handleClaim = (placeId: number) => {
    if (!canAddMore) {
      alert('已達景點數量上限，請升級方案');
      return;
    }
    claimMutation.mutate(placeId);
  };

  const handleCreatePlace = () => {
    if (!newPlace.name || !newPlace.address || !newPlace.city || !newPlace.category) {
      alert('請填寫必要欄位');
      return;
    }
    if (!canAddMore) {
      alert('已達景點數量上限，請升級方案');
      return;
    }
    createMutation.mutate();
  };

  const isLoading = claimMutation.isPending || createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canAddMore}>
          <Plus className="h-4 w-4 mr-2" />
          認領景點
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>認領或新增景點</DialogTitle>
          <DialogDescription>
            搜尋現有景點進行認領，或新增您自己的景點。
            {maxPlaces !== Infinity && (
              <span className="block mt-1 text-sm">
                目前已認領 {currentPlacesCount} / {maxPlaces} 個景點
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* 搜尋區塊 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋景點名稱或地址..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={searchQuery.length < 2}>
              搜尋
            </Button>
          </div>

          {/* 搜尋結果 */}
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {searchError && (
            <p className="text-sm text-destructive text-center py-4">
              搜尋失敗，請稍後再試
            </p>
          )}

          {searchResults?.places && searchResults.places.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                找到 {searchResults.places.length} 個結果
              </p>
              {searchResults.places.map((place: ClaimablePlace) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  variant="claimable"
                  onClaim={() => handleClaim(place.id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}

          {activeSearch && searchResults?.places?.length === 0 && !isSearching && (
            <div className="text-center py-8 space-y-3">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                找不到「{activeSearch}」相關的景點
              </p>
              <Button
                variant="outline"
                onClick={() => setShowNewPlaceForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                新增此景點
              </Button>
            </div>
          )}

          {/* 新增景點表單 */}
          {showNewPlaceForm && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">新增景點</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPlaceForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">景點名稱 *</Label>
                  <Input
                    id="name"
                    value={newPlace.name}
                    onChange={(e) =>
                      setNewPlace({ ...newPlace, name: e.target.value })
                    }
                    placeholder="例：星巴克信義店"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">類別 *</Label>
                  <Select
                    value={newPlace.category}
                    onValueChange={(value) =>
                      setNewPlace({ ...newPlace, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇類別" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">城市 *</Label>
                  <Input
                    id="city"
                    value={newPlace.city}
                    onChange={(e) =>
                      setNewPlace({ ...newPlace, city: e.target.value })
                    }
                    placeholder="例：台北"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">區域</Label>
                  <Input
                    id="district"
                    value={newPlace.district}
                    onChange={(e) =>
                      setNewPlace({ ...newPlace, district: e.target.value })
                    }
                    placeholder="例：信義區"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">地址 *</Label>
                  <Input
                    id="address"
                    value={newPlace.address}
                    onChange={(e) =>
                      setNewPlace({ ...newPlace, address: e.target.value })
                    }
                    placeholder="完整地址"
                  />
                </div>
              </div>

              <Button
                onClick={handleCreatePlace}
                disabled={isLoading}
                className="w-full"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    新增中...
                  </>
                ) : (
                  '確認新增'
                )}
              </Button>
            </div>
          )}

          {/* 錯誤訊息 */}
          {(claimMutation.error || createMutation.error) && (
            <p className="text-sm text-destructive text-center">
              {claimMutation.error?.message ||
                createMutation.error?.message ||
                '操作失敗，請稍後再試'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlaceClaimModal;
