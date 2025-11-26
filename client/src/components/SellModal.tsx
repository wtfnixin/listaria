import { useState, useCallback } from "react";
import { X, Upload, Camera, ChevronRight, ChevronLeft, Laptop, Car, Smartphone, Shirt, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdFormData) => void;
}

interface AdFormData {
  category: string;
  subcategory: string;
  title: string;
  description: string;
  price: string;
  condition: string;
  images: File[];
  location: string;
  phone: string;
  showPhone: boolean;
}

const categories = [
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "car", name: "Car", icon: Car },
  { id: "mobile", name: "Mobile", icon: Smartphone },
  { id: "clothing", name: "Clothing", icon: Shirt },
];

const subcategories: Record<string, string[]> = {
  electronics: ["Laptops", "Computers", "Cameras", "TV & Audio", "Gaming", "Accessories"],
  car: ["Cars", "Motorcycles", "Scooters", "Bicycles", "Spare Parts", "Accessories"],
  mobile: ["Smartphones", "Tablets", "Accessories", "Smartwatches", "Feature Phones"],
  clothing: ["Men", "Women", "Kids", "Footwear", "Accessories", "Sportswear"],
};

export default function SellModal({ isOpen, onClose, onSubmit }: SellModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AdFormData>({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    price: "",
    condition: "used",
    images: [],
    location: "",
    phone: "",
    showPhone: true,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId, subcategory: "" });
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setFormData({ ...formData, subcategory });
    setStep(2);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const maxWidth = 800;
          const maxHeight = 800;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob!], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.7
          );
        };
      };
    });
  };

  const handleFiles = async (files: File[]) => {
    const compressedFiles = await Promise.all(
      files.map((file) => compressImage(file))
    );
    
    const newImages = [...formData.images, ...compressedFiles].slice(0, 12);
    setFormData({ ...formData, images: newImages });

    const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 12));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      category: "",
      subcategory: "",
      title: "",
      description: "",
      price: "",
      condition: "used",
      images: [],
      location: "",
      phone: "",
      showPhone: true,
    });
    setImagePreviews([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canProceedStep2 = formData.title && formData.description && formData.price;
  const canProceedStep3 = formData.images.length > 0;
  const canSubmit = formData.location && formData.phone;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold" data-testid="text-sell-title">
            {step === 1 && "Select a Category"}
            {step === 2 && "Add Item Details"}
            {step === 3 && "Upload Photos"}
            {step === 4 && "Location & Contact"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 ${
                    s < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                    formData.category === cat.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  <cat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </button>
              ))}
            </div>

            {formData.category && (
              <div className="space-y-2">
                <Label>Select Subcategory</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {subcategories[formData.category]?.map((sub) => (
                    <Button
                      key={sub}
                      variant={formData.subcategory === sub ? "default" : "outline"}
                      onClick={() => handleSubcategorySelect(sub)}
                      className="justify-start"
                      data-testid={`button-subcategory-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {sub}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a descriptive title (max 70 characters)"
                maxLength={70}
                value={formData.title}
                onChange={handleInputChange}
                data-testid="input-title"
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/70 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your item in detail. Include condition, features, and any defects."
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                data-testid="input-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    className="pl-8"
                    value={formData.price}
                    onChange={handleInputChange}
                    data-testid="input-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    setFormData({ ...formData, condition: value })
                  }
                >
                  <SelectTrigger data-testid="select-condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} data-testid="button-back-step1">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                data-testid="button-next-step3"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
                data-testid="input-images"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium mb-1">Drag & drop images here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse (up to 12 images)
                </p>
                <Button variant="outline" type="button">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                      data-testid={`button-remove-image-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} data-testid="button-back-step2">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
                data-testid="button-next-step4"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter your city or area"
                  className="pl-9"
                  value={formData.location}
                  onChange={handleInputChange}
                  data-testid="input-location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  +91
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-12"
                  value={formData.phone}
                  onChange={handleInputChange}
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPhone"
                checked={formData.showPhone}
                onChange={(e) =>
                  setFormData({ ...formData, showPhone: e.target.checked })
                }
                className="rounded border-input"
                data-testid="checkbox-show-phone"
              />
              <Label htmlFor="showPhone" className="text-sm font-normal">
                Show my phone number in the ad
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)} data-testid="button-back-step3">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-publish"
              >
                Publish Ad
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
