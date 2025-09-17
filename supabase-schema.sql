-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INQUILINO', 'PROPIETARIO');
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'MATCHED_ONLY');
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- Create User table
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255),
    "image" TEXT,
    "videoUrl" TEXT,
    "passwordHash" TEXT,
    "provider" VARCHAR(50) DEFAULT 'credentials',
    "role" "Role" DEFAULT 'INQUILINO',
    "plan" VARCHAR(50) DEFAULT 'standard',
    "city" VARCHAR(255),
    "noiseLevel" INTEGER,
    "maxDistanceKm" INTEGER,
    "about" TEXT,
    "tags" TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Property table
CREATE TABLE "Property" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "city" VARCHAR(255),
    "priceMonthly" INTEGER NOT NULL,
    "photos" TEXT[] DEFAULT '{}',
    "visibility" "Visibility" DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RoommateLike table
CREATE TABLE "RoommateLike" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userAId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "userBId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "score" INTEGER NOT NULL,
    "status" "MatchStatus" DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("userAId", "userBId")
);

-- Create PropertyMatch table
CREATE TABLE "PropertyMatch" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "propertyId" UUID NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
    "tenantId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "score" INTEGER NOT NULL,
    "status" "MatchStatus" DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("propertyId", "tenantId")
);

-- Create Blog table
CREATE TABLE "Blog" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SmtpSetting table
CREATE TABLE "SmtpSetting" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "host" VARCHAR(255) NOT NULL,
    "port" INTEGER NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    "fromEmail" VARCHAR(255) NOT NULL,
    "secure" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ApiKey table
CREATE TABLE "ApiKey" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "label" VARCHAR(255) NOT NULL,
    "keyHash" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastUsedAt" TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE INDEX "Property_visibility_idx" ON "Property"("visibility");
CREATE INDEX "RoommateLike_userAId_idx" ON "RoommateLike"("userAId");
CREATE INDEX "RoommateLike_userBId_idx" ON "RoommateLike"("userBId");
CREATE INDEX "RoommateLike_status_idx" ON "RoommateLike"("status");
CREATE INDEX "PropertyMatch_propertyId_idx" ON "PropertyMatch"("propertyId");
CREATE INDEX "PropertyMatch_tenantId_idx" ON "PropertyMatch"("tenantId");
CREATE INDEX "PropertyMatch_status_idx" ON "PropertyMatch"("status");
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");
CREATE INDEX "ApiKey_active_idx" ON "ApiKey"("active");

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_updated_at BEFORE UPDATE ON "Property" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roommate_like_updated_at BEFORE UPDATE ON "RoommateLike" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_match_updated_at BEFORE UPDATE ON "PropertyMatch" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON "Blog" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smtp_setting_updated_at BEFORE UPDATE ON "SmtpSetting" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoommateLike" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyMatch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Blog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SmtpSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- User policies
CREATE POLICY "Users can view their own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Public users can be viewed by authenticated users" ON "User"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Property policies
CREATE POLICY "Properties are viewable by authenticated users" ON "Property"
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create their own properties" ON "Property"
    FOR INSERT WITH CHECK (auth.uid()::text = "ownerId");

CREATE POLICY "Users can update their own properties" ON "Property"
    FOR UPDATE USING (auth.uid()::text = "ownerId");

CREATE POLICY "Users can delete their own properties" ON "Property"
    FOR DELETE USING (auth.uid()::text = "ownerId");

-- RoommateLike policies
CREATE POLICY "Users can view their own likes" ON "RoommateLike"
    FOR SELECT USING (auth.uid()::text = "userAId" OR auth.uid()::text = "userBId");

CREATE POLICY "Users can create likes" ON "RoommateLike"
    FOR INSERT WITH CHECK (auth.uid()::text = "userAId");

CREATE POLICY "Users can update their own likes" ON "RoommateLike"
    FOR UPDATE USING (auth.uid()::text = "userAId" OR auth.uid()::text = "userBId");

-- PropertyMatch policies
CREATE POLICY "Users can view their property matches" ON "PropertyMatch"
    FOR SELECT USING (
        auth.uid()::text = "tenantId" OR 
        auth.uid()::text IN (SELECT "ownerId" FROM "Property" WHERE "id" = "propertyId")
    );

CREATE POLICY "Tenants can create property matches" ON "PropertyMatch"
    FOR INSERT WITH CHECK (auth.uid()::text = "tenantId");

CREATE POLICY "Users can update their property matches" ON "PropertyMatch"
    FOR UPDATE USING (
        auth.uid()::text = "tenantId" OR 
        auth.uid()::text IN (SELECT "ownerId" FROM "Property" WHERE "id" = "propertyId")
    );

-- Blog policies (admin only for now)
CREATE POLICY "Blogs are viewable by everyone" ON "Blog"
    FOR SELECT USING (published = true OR auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Only admins can manage blogs" ON "Blog"
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- SmtpSetting policies (admin only)
CREATE POLICY "Only admins can manage SMTP settings" ON "SmtpSetting"
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- ApiKey policies
CREATE POLICY "Users can view their own API keys" ON "ApiKey"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create their own API keys" ON "ApiKey"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own API keys" ON "ApiKey"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own API keys" ON "ApiKey"
    FOR DELETE USING (auth.uid()::text = "userId");