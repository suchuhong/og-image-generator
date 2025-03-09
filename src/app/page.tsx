"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { themes } from "./api/og/constants";
import { fonts } from "./api/og/constants";
import { ImageMode } from "./api/og/types";
import Image from "next/image";

export default function Home() {
  const [title, setTitle] = useState("Default Title");
  const [description, setDescription] = useState("Default description for your content");
  const [theme, setTheme] = useState("light");
  const [font, setFont] = useState("sans");
  const [customBgColor, setCustomBgColor] = useState("");
  const [customTextColor, setCustomTextColor] = useState("");
  const [customAccentColor, setCustomAccentColor] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [imageMode, setImageMode] = useState<ImageMode>("cover");
  const [origin, setOrigin] = useState("");
  
  // Set origin on client side only
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  
  // Calculate the preview URL
  const previewUrl = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&theme=${theme}&font=${font}${customBgColor ? `&bgColor=${encodeURIComponent(customBgColor)}` : ''}${customTextColor ? `&textColor=${encodeURIComponent(customTextColor)}` : ''}${customAccentColor ? `&accentColor=${encodeURIComponent(customAccentColor)}` : ''}${backgroundImage ? `&backgroundImage=${encodeURIComponent(backgroundImage)}` : ''}&imageMode=${imageMode}`;
  
  // Generate a URL for actual use
  const ogImageUrl = origin ? `${origin}${previewUrl}` : previewUrl;
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">OG Image Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Settings</CardTitle>
                  <CardDescription>Enter your content information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter title" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Enter description" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                    >
                      {Object.keys(fonts).map((fontKey) => (
                        <option key={fontKey} value={fontKey}>
                          {fontKey}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      {Object.keys(themes).map((themeKey) => (
                        <option key={themeKey} value={themeKey}>
                          {themeKey}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {theme === 'custom' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Background Color (hex)</label>
                        <div className="flex gap-2">
                          <Input 
                            type="text"
                            value={customBgColor} 
                            onChange={(e) => setCustomBgColor(e.target.value)} 
                            placeholder="#ffffff" 
                          />
                          <input 
                            type="color" 
                            value={customBgColor || "#ffffff"} 
                            onChange={(e) => setCustomBgColor(e.target.value)} 
                            className="w-10 h-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Text Color (hex)</label>
                        <div className="flex gap-2">
                          <Input 
                            type="text"
                            value={customTextColor} 
                            onChange={(e) => setCustomTextColor(e.target.value)} 
                            placeholder="#000000" 
                          />
                          <input 
                            type="color" 
                            value={customTextColor || "#000000"} 
                            onChange={(e) => setCustomTextColor(e.target.value)} 
                            className="w-10 h-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Accent Color (hex)</label>
                        <div className="flex gap-2">
                          <Input 
                            type="text"
                            value={customAccentColor} 
                            onChange={(e) => setCustomAccentColor(e.target.value)} 
                            placeholder="#0070f3" 
                          />
                          <input 
                            type="color" 
                            value={customAccentColor || "#0070f3"} 
                            onChange={(e) => setCustomAccentColor(e.target.value)} 
                            className="w-10 h-10"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Fine-tune your OG image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Background Image URL</label>
                    <Input 
                      value={backgroundImage} 
                      onChange={(e) => setBackgroundImage(e.target.value)} 
                      placeholder="https://example.com/image.jpg" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Mode</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={imageMode}
                      onChange={(e) => setImageMode(e.target.value as ImageMode)}
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="repeat">Repeat</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Copy this URL to use in your meta tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-2 bg-gray-100 rounded-md overflow-x-auto">
                  <code className="text-sm whitespace-nowrap">{ogImageUrl}</code>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigator.clipboard.writeText(ogImageUrl)}
                  className="w-full"
                >
                  Copy URL
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>This is how your OG image will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-lg border">
                <Image 
                  src={previewUrl} 
                  alt="OG Image Preview" 
                  width={1200}
                  height={630}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => window.open(previewUrl, '_blank')}
              >
                Open Full Size
              </Button>
              <Button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewUrl;
                  link.download = 'og-image.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Meta Tag Example</CardTitle>
              <CardDescription>Add this to your HTML head</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2 bg-gray-100 rounded-md overflow-x-auto">
                <code className="text-sm whitespace-pre-wrap">{`<meta property="og:image" content="${ogImageUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${ogImageUrl}" />`}</code>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  const metaCode = `<meta property="og:image" content="${ogImageUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${ogImageUrl}" />`;
                  navigator.clipboard.writeText(metaCode);
                }}
                className="w-full"
              >
                Copy Meta Tags
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
