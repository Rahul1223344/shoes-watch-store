import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Store,
  User,
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Store Administration
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your store information and administration options.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Store Information */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Store size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black">
                Store Information
              </h2>

              <p className="text-sm text-gray-500">
                Basic information about your store.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Store Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                Lakshay Fashion Collection
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Categories
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                Shoes & Watches
              </p>
            </div>

          </div>
        </div>

        {/* Support */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Mail size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black">
                Customer Support
              </h2>

              <p className="text-sm text-gray-500">
                Support contact information.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email Support
                </p>

                <p className="mt-1 text-sm font-semibold">
                   lakshayfashioncollection@gmail.com
                </p>
              </div>

              <Mail
                size={18}
                className="shrink-0 text-gray-400"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  WhatsApp Support
                </p>

                <p className="mt-1 text-sm font-semibold">
                  +91 78519 08276
                </p>
              </div>

              <MessageCircle
                size={18}
                className="shrink-0 text-gray-400"
              />
            </div>

          </div>
        </div>

        {/* Admin Account */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <User size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black">
                Admin Account
              </h2>

              <p className="text-sm text-gray-500">
                Your administrator account.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              You are currently logged in as an administrator.
            </p>

            <p className="mt-2 text-sm font-semibold text-green-600">
              Account Active
            </p>
          </div>
        </div>

        {/* Live Store */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black">
                Live Store
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Open your customer-facing website.
              </p>
            </div>

            <ArrowUpRight
              size={20}
              className="text-gray-400"
            />

          </div>

          <Link
            href="/"
            target="_blank"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Visit Store
          </Link>

        </div>

      </div>
    </div>
  );
}