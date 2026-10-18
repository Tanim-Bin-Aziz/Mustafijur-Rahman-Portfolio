"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reorder } from "framer-motion";
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  updateProfile,
  type ProfileFormState,
} from "@/app/dashboard/profile/actions";
import type { IconType } from "react-icons";
import { loadFullIconMap, type IconMap } from "@/lib/icons";
import {
  DEFAULT_PROFILE,
  findIconName,
  PROFILE_ICONS,
  PROFILE_SECTIONS,
  SECTION_LABELS,
  type ProfileData,
} from "@/data/profile";

const fieldClass =
  "w-full rounded-lg border border-cream/10 bg-bg/60 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-[#8DB355]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45";

function listMap<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */
function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-cream/10 bg-card" open>
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <div>
          <h2 className="font-serif text-lg font-semibold text-cream">
            {title}
          </h2>
          {hint && <p className="mt-0.5 text-xs text-cream/40">{hint}</p>}
        </div>
        <ChevronDown
          size={16}
          className="text-cream/40 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="space-y-4 border-t border-cream/10 px-5 py-5">
        {children}
      </div>
    </details>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      title="Remove"
      onClick={onClick}
      className="rounded-full border border-cream/10 p-1.5 text-cream/50 transition-colors hover:border-red-500/40 hover:text-red-400"
    >
      <Trash2 size={13} />
    </button>
  );
}

function AddBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3.5 py-1.5 text-xs font-medium text-cream/60 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
    >
      <Plus size={13} />
      {children}
    </button>
  );
}

function ItemCard({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative space-y-3 rounded-lg border border-cream/10 bg-bg/40 p-4">
      <div className="absolute right-3 top-3">
        <RemoveBtn onClick={onRemove} />
      </div>
      <div className="pr-9">{children}</div>
    </div>
  );
}

function IconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [dynamicIcons, setDynamicIcons] = useState<IconMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadFullIconMap().then((map) => {
      if (!cancelled) setDynamicIcons(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const resolved = findIconName(value, dynamicIcons ?? undefined);
  const Icon = resolved
    ? (dynamicIcons?.[resolved] ?? PROFILE_ICONS[resolved])
    : null;

  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cream/10 bg-bg/60 text-cream/60">
        {Icon ? (
          <Icon size={15} />
        ) : (
          <span className="font-mono text-[9px] uppercase">icon</span>
        )}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="FaStar, LuHeart…"
        className={`${fieldClass} min-w-0 flex-1`}
      />
    </div>
  );
}

function ChipsEditor({
  label,
  items,
  onChange,
  addToTop = false,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  addToTop?: boolean;
}) {
  const [value, setValue] = useState("");

  const add = () => {
    const next = value.trim();
    if (!next || items.includes(next)) return;
    onChange(addToTop ? [next, ...items] : [...items, next]);
    setValue("");
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-bg/60 px-2.5 py-1 text-xs text-cream/70"
          >
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => onChange(items.filter((x) => x !== item))}
              className="text-cream/30 transition-colors hover:text-red-400"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-cream/30">No tags yet.</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type a tag and press Add"
          className={fieldClass}
        />
        <AddBtn onClick={add}>Add</AddBtn>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Editor
--------------------------------------------------------- */
export default function ProfileEditor({ profile }: { profile: ProfileData }) {
  const [draft, setDraft] = useState<ProfileData>(() => clone(profile));
  const [logoPreview, setLogoPreview] = useState(profile.avatar);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const skillLogoRef = useRef<Map<string, { url: string; name: string }>>(
    new Map(),
  );

  const [state, formAction, isPending] = useActionState<
    ProfileFormState,
    FormData
  >(updateProfile, { error: null, saved: false });

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const discard = () => {
    setDraft(clone(profile));
    setLogoPreview(profile.avatar);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetDefaults = () => {
    setDraft(clone(DEFAULT_PROFILE));
    setLogoPreview(DEFAULT_PROFILE.avatar);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleSection = (key: string) =>
    setDraft((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: prev.sectionVisibility[key] === false,
      },
    }));

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      {/* Save bar */}
      <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream/10 bg-[#0d0d0cf2] px-4 py-3 backdrop-blur-xl">
        <div>
          <h1 className="font-serif text-xl font-semibold text-cream">
            Profile Management
          </h1>
          <p className="text-xs text-cream/45">
            Edits appear on{" "}
            <Link
              href="/profile"
              target="_blank"
              className="text-[#8DB355] underline"
            >
              /profile
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {state.error && (
            <span className="max-w-[16rem] text-xs text-red-300">
              {state.error}
            </span>
          )}
          {state.saved && !state.error && (
            <span className="inline-flex items-center gap-1 text-xs text-[#8DB355]">
              <Check size={13} /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={discard}
            className="rounded-full border border-cream/10 px-4 py-2 text-xs text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            title="Reset all content to the original defaults"
            className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-4 py-2 text-xs text-cream/60 transition-colors hover:border-cream/25 hover:text-cream"
          >
            <RotateCcw size={12} /> Defaults
          </button>
          <button
            type="submit"
            form="profile-form"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#8DB355] px-5 py-2 text-xs font-semibold text-bg transition-colors hover:bg-[#9cc163] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save changes
          </button>
        </div>
      </div>

      <form id="profile-form" action={formAction} className="space-y-6">
        <input type="hidden" name="data" value={JSON.stringify(draft)} />

        {/* ── Header / branding ── */}
        <Panel
          title="Header & Branding"
          hint="Logo, name, title and status line shown at the top of /profile"
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-cream/10">
              <Image
                src={logoPreview}
                alt="Profile logo"
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>

            <div className="flex-1 min-w-[14rem] space-y-3">
              <label
                htmlFor="logo"
                className="flex w-fit cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-cream/15 px-4 py-2.5 text-sm text-cream/50 transition-colors hover:border-[#8DB355] hover:text-[#8DB355]"
              >
                {fileName ? (
                  <>
                    <Check size={15} className="text-[#8DB355]" />
                    <span className="truncate text-cream/70">{fileName}</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={15} />
                    Choose logo / photo
                  </>
                )}
              </label>
              <input
                ref={fileRef}
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFileName(file?.name || "");
                  if (file) setLogoPreview(URL.createObjectURL(file));
                }}
              />
              <p className="text-xs text-cream/30">
                Optional — leave empty to keep the current image.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Status line">
              <input
                value={draft.status}
                onChange={(e) => set("status", e.target.value)}
                placeholder="Open to opportunities"
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Title / role">
            <input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field label="Contact entries">
            <div className="space-y-3">
              {draft.contactEntries.map((entry, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-lg border border-cream/10 bg-bg/40 p-3 sm:grid-cols-2"
                >
                  <div className="flex items-end gap-2 sm:col-span-2">
                    <div className="flex-1">
                      <span className={labelClass}>Label</span>
                      <input
                        value={entry.label}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            contactEntries: listMap(p.contactEntries, i, {
                              label: e.target.value,
                            }),
                          }))
                        }
                        className={fieldClass}
                      />
                    </div>
                    <RemoveBtn
                      onClick={() =>
                        set(
                          "contactEntries",
                          draft.contactEntries.filter((_, idx) => idx !== i),
                        )
                      }
                    />
                  </div>
                  <Field label="Icon">
                    <IconSelect
                      value={entry.icon}
                      onChange={(icon) =>
                        setDraft((p) => ({
                          ...p,
                          contactEntries: listMap(p.contactEntries, i, {
                            icon,
                          }),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Value">
                    <input
                      value={entry.value}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          contactEntries: listMap(p.contactEntries, i, {
                            value: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Link (optional — tel:, mailto:, https://)">
                      <input
                        value={entry.href ?? ""}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            contactEntries: listMap(p.contactEntries, i, {
                              href: e.target.value,
                            }),
                          }))
                        }
                        className={fieldClass}
                      />
                    </Field>
                  </div>
                </div>
              ))}
              <AddBtn
                onClick={() =>
                  set("contactEntries", [
                    ...draft.contactEntries,
                    { icon: "FaStar", label: "New", value: "" },
                  ])
                }
              >
                Add contact entry
              </AddBtn>
            </div>
          </Field>

          <Field label="Social icons">
            <div className="space-y-3">
              {draft.socialLinks.map((link, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-lg border border-cream/10 bg-bg/40 p-3 sm:grid-cols-2"
                >
                  <div className="flex items-end gap-2 sm:col-span-2">
                    <div className="flex-1">
                      <span className={labelClass}>Label</span>
                      <input
                        value={link.label}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            socialLinks: listMap(p.socialLinks, i, {
                              label: e.target.value,
                            }),
                          }))
                        }
                        className={fieldClass}
                      />
                    </div>
                    <RemoveBtn
                      onClick={() =>
                        set(
                          "socialLinks",
                          draft.socialLinks.filter((_, idx) => idx !== i),
                        )
                      }
                    />
                  </div>
                  <Field label="Icon">
                    <IconSelect
                      value={link.icon}
                      onChange={(icon) =>
                        setDraft((p) => ({
                          ...p,
                          socialLinks: listMap(p.socialLinks, i, { icon }),
                        }))
                      }
                    />
                  </Field>
                  <Field label="URL">
                    <input
                      value={link.href}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          socialLinks: listMap(p.socialLinks, i, {
                            href: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-xs text-cream/50">
                    <input
                      type="checkbox"
                      checked={link.external}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          socialLinks: listMap(p.socialLinks, i, {
                            external: e.target.checked,
                          }),
                        }))
                      }
                      className="accent-[#8DB355]"
                    />
                    Opens in a new tab
                  </label>
                </div>
              ))}
              <AddBtn
                onClick={() =>
                  set("socialLinks", [
                    ...draft.socialLinks,
                    {
                      label: "New Social",
                      href: "https://",
                      icon: "FaStar",
                      external: true,
                    },
                  ])
                }
              >
                Add social icon
              </AddBtn>
            </div>
          </Field>
        </Panel>

        {/* ── About ── */}
        <Panel title="About Me" hint="One textarea per paragraph">
          <div className="space-y-3">
            {draft.about.map((paragraph, i) => (
              <div key={i} className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <RemoveBtn
                    onClick={() =>
                      set(
                        "about",
                        draft.about.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>
                <textarea
                  value={paragraph}
                  rows={4}
                  onChange={(e) =>
                    set("about", listMap(draft.about, i, e.target.value))
                  }
                  className={`${fieldClass} pr-10`}
                />
              </div>
            ))}
            <AddBtn onClick={() => set("about", [...draft.about, ""])}>
              Add paragraph
            </AddBtn>
          </div>
        </Panel>

        {/* ── Skills ── */}
        <Panel
          title="Skill Tags"
          hint="Categories, colors, icons and every skill tag on the profile"
        >
          <div className="space-y-4">
            {draft.skillCategories.map((cat, ci) => (
              <div
                key={ci}
                className="relative space-y-3 rounded-lg border border-cream/10 bg-bg/40 p-4"
              >
                <div className="absolute right-3 top-3">
                  <RemoveBtn
                    onClick={() =>
                      set(
                        "skillCategories",
                        draft.skillCategories.filter((_, idx) => idx !== ci),
                      )
                    }
                  />
                </div>

                <div className="grid gap-3 pr-9 sm:grid-cols-3">
                  <Field label="Category name">
                    <input
                      value={cat.label}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          skillCategories: listMap(
                            p.skillCategories,
                            ci,
                            { label: e.target.value },
                          ),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Icon">
                    <IconSelect
                      value={cat.icon}
                      onChange={(icon) =>
                        setDraft((p) => ({
                          ...p,
                          skillCategories: listMap(p.skillCategories, ci, {
                            icon,
                          }),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Color">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cat.color}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            skillCategories: listMap(p.skillCategories, ci, {
                              color: e.target.value,
                            }),
                          }))
                        }
                        className="h-10 w-12 cursor-pointer rounded border border-cream/10 bg-bg/60"
                      />
                      <span className="font-mono text-xs text-cream/40">
                        {cat.color}
                      </span>
                    </div>
                  </Field>
                </div>

                <Field label="Logo image (optional — png, jpg, etc.)">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      name={
                        cat.iconImage?.startsWith("upload:")
                          ? `skill-icon-${cat.iconImage.slice(7)}`
                          : undefined
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const key = `${Date.now()}-${Math.random()
                          .toString(36)
                          .slice(2, 8)}`;
                        skillLogoRef.current.set(key, {
                          url: URL.createObjectURL(file),
                          name: file.name,
                        });
                        setDraft((p) => ({
                          ...p,
                          skillCategories: listMap(p.skillCategories, ci, {
                            iconImage: `upload:${key}`,
                          }),
                        }));
                      }}
                      className={`${fieldClass} file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#8DB355]/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#8DB355]`}
                    />
                    {cat.iconImage && (
                      <>
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-cream/10">
                          <Image
                            src={
                              cat.iconImage.startsWith("upload:")
                                ? (skillLogoRef.current.get(
                                    cat.iconImage.slice(7),
                                  )?.url ?? "")
                                : cat.iconImage
                            }
                            alt={`${cat.label} logo`}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        </div>
                        <span className="min-w-0 truncate text-xs text-cream/50">
                          {cat.iconImage.startsWith("upload:")
                            ? skillLogoRef.current.get(cat.iconImage.slice(7))
                                ?.name
                            : cat.iconImage.split("/").pop()}
                        </span>
                        <RemoveBtn
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              skillCategories: listMap(p.skillCategories, ci, {
                                iconImage: undefined,
                              }),
                            }))
                          }
                        />
                      </>
                    )}
                  </div>
                </Field>

                <div className="space-y-2 border-t border-cream/10 pt-3">
                  <span className={labelClass}>Skill tags</span>
                  {cat.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="space-y-2 rounded-lg border border-cream/10 bg-bg/40 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          value={item.name}
                          onChange={(e) =>
                            setDraft((p) => {
                              const categories = [...p.skillCategories];
                              const category = { ...categories[ci] };
                              category.items = listMap(category.items, ii, {
                                name: e.target.value,
                              });
                              categories[ci] = category;
                              return { ...p, skillCategories: categories };
                            })
                          }
                          placeholder="Skill name"
                          className={`${fieldClass} min-w-0 flex-1`}
                        />
                        <div className="w-44 shrink-0">
                          <IconSelect
                            value={item.icon}
                            onChange={(icon) =>
                              setDraft((p) => {
                                const categories = [...p.skillCategories];
                                const category = { ...categories[ci] };
                                category.items = listMap(category.items, ii, {
                                  icon,
                                });
                                categories[ci] = category;
                                return { ...p, skillCategories: categories };
                              })
                            }
                          />
                        </div>
                        <RemoveBtn
                          onClick={() =>
                            setDraft((p) => {
                              const categories = [...p.skillCategories];
                              const category = { ...categories[ci] };
                              category.items = category.items.filter(
                                (_, idx) => idx !== ii,
                              );
                              categories[ci] = category;
                              return { ...p, skillCategories: categories };
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          name={
                            item.iconImage?.startsWith("upload:")
                              ? `skill-tag-icon-${item.iconImage.slice(7)}`
                              : undefined
                          }
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const key = `${Date.now()}-${Math.random()
                              .toString(36)
                              .slice(2, 8)}`;
                            skillLogoRef.current.set(key, {
                              url: URL.createObjectURL(file),
                              name: file.name,
                            });
                            setDraft((p) => {
                              const categories = [...p.skillCategories];
                              const category = { ...categories[ci] };
                              category.items = listMap(category.items, ii, {
                                iconImage: `upload:${key}`,
                              });
                              categories[ci] = category;
                              return { ...p, skillCategories: categories };
                            });
                          }}
                          className={`${fieldClass} file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#8DB355]/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#8DB355]`}
                        />
                        {item.iconImage && (
                          <>
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-cream/10">
                              <Image
                                src={
                                  item.iconImage.startsWith("upload:")
                                    ? (skillLogoRef.current.get(
                                        item.iconImage.slice(7),
                                      )?.url ?? "")
                                    : item.iconImage
                                }
                                alt={`${item.name} logo`}
                                fill
                                sizes="32px"
                                className="object-contain"
                              />
                            </div>
                            <span className="min-w-0 truncate text-xs text-cream/50">
                              {item.iconImage.startsWith("upload:")
                                ? skillLogoRef.current.get(
                                    item.iconImage.slice(7),
                                  )?.name
                                : item.iconImage.split("/").pop()}
                            </span>
                            <button
                              type="button"
                              title="Remove logo"
                              onClick={() =>
                                setDraft((p) => {
                                  const categories = [...p.skillCategories];
                                  const category = { ...categories[ci] };
                                  category.items = listMap(category.items, ii, {
                                    iconImage: undefined,
                                  });
                                  categories[ci] = category;
                                  return { ...p, skillCategories: categories };
                                })
                              }
                              className="rounded-full border border-cream/10 p-1 text-cream/40 transition-colors hover:border-red-500/40 hover:text-red-400"
                            >
                              <X size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <AddBtn
                    onClick={() =>
                      setDraft((p) => {
                        const categories = [...p.skillCategories];
                        const category = { ...categories[ci] };
                        category.items = [
                          ...category.items,
                          { name: "New skill", icon: "FaStar" },
                        ];
                        categories[ci] = category;
                        return { ...p, skillCategories: categories };
                      })
                    }
                  >
                    Add skill tag
                  </AddBtn>
                </div>
              </div>
            ))}
            <AddBtn
              onClick={() =>
                set("skillCategories", [
                  ...draft.skillCategories,
                  {
                    label: "New Category",
                    icon: "FaStar",
                    color: "#8DB355",
                    items: [],
                  },
                ])
              }
            >
              Add skill category
            </AddBtn>
          </div>
        </Panel>

        {/* ── Software & AI Tools ── */}
        <Panel
          title="Software & AI Tools"
          hint="Icon tiles shown above Skills on /profile"
        >
          <div className="space-y-3">
            {draft.softwareTools.map((tool, i) => (
              <div
                key={i}
                className="space-y-2 rounded-lg border border-cream/10 bg-bg/40 p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={tool.name}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        softwareTools: listMap(p.softwareTools, i, {
                          name: e.target.value,
                        }),
                      }))
                    }
                    placeholder="Tool name"
                    className={`${fieldClass} min-w-0 flex-1`}
                  />
                  <div className="w-44 shrink-0">
                    <IconSelect
                      value={tool.icon}
                      onChange={(icon) =>
                        setDraft((p) => ({
                          ...p,
                          softwareTools: listMap(p.softwareTools, i, { icon }),
                        }))
                      }
                    />
                  </div>
                  <RemoveBtn
                    onClick={() =>
                      set(
                        "softwareTools",
                        draft.softwareTools.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    name={
                      tool.iconImage?.startsWith("upload:")
                        ? `software-icon-${tool.iconImage.slice(7)}`
                        : undefined
                    }
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const key = `${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 8)}`;
                      skillLogoRef.current.set(key, {
                        url: URL.createObjectURL(file),
                        name: file.name,
                      });
                      setDraft((p) => ({
                        ...p,
                        softwareTools: listMap(p.softwareTools, i, {
                          iconImage: `upload:${key}`,
                        }),
                      }));
                    }}
                    className={`${fieldClass} file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#8DB355]/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#8DB355]`}
                  />
                  {tool.iconImage && (
                    <>
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-cream/10">
                        <Image
                          src={
                            tool.iconImage.startsWith("upload:")
                              ? (skillLogoRef.current.get(
                                  tool.iconImage.slice(7),
                                )?.url ?? "")
                              : tool.iconImage
                          }
                          alt={`${tool.name} logo`}
                          fill
                          sizes="32px"
                          className="object-contain"
                        />
                      </div>
                      <span className="min-w-0 truncate text-xs text-cream/50">
                        {tool.iconImage.startsWith("upload:")
                          ? skillLogoRef.current.get(tool.iconImage.slice(7))
                              ?.name
                          : tool.iconImage.split("/").pop()}
                      </span>
                      <button
                        type="button"
                        title="Remove logo"
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            softwareTools: listMap(p.softwareTools, i, {
                              iconImage: undefined,
                            }),
                          }))
                        }
                        className="rounded-full border border-cream/10 p-1 text-cream/40 transition-colors hover:border-red-500/40 hover:text-red-400"
                      >
                        <X size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            <AddBtn
              onClick={() =>
                set("softwareTools", [
                  ...draft.softwareTools,
                  { name: "New tool", icon: "FaStar" },
                ])
              }
            >
              Add tool
            </AddBtn>
          </div>
        </Panel>

        {/* ── Soft skills ── */}
        <Panel title="Strengths & Passions" hint="The tag chips in the sidebar">
          <ChipsEditor
            label="Strengths"
            items={draft.softSkills.strengths}
            onChange={(strengths) =>
              set("softSkills", { ...draft.softSkills, strengths })
            }
          />
          <ChipsEditor
            label="Passions"
            items={draft.softSkills.passions}
            onChange={(passions) =>
              set("softSkills", { ...draft.softSkills, passions })
            }
          />
        </Panel>

        {/* ── Experience ── */}
        <Panel title="Professional Experience">
          <div className="space-y-3">
            {draft.experiences.map((exp, i) => (
              <ItemCard
                key={i}
                onRemove={() =>
                  set(
                    "experiences",
                    draft.experiences.filter((_, idx) => idx !== i),
                  )
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Title">
                    <input
                      value={exp.title}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          experiences: listMap(p.experiences, i, {
                            title: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      value={exp.company}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          experiences: listMap(p.experiences, i, {
                            company: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Department">
                    <input
                      value={exp.dept}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          experiences: listMap(p.experiences, i, {
                            dept: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Type">
                    <input
                      value={exp.type}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          experiences: listMap(p.experiences, i, {
                            type: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                </div>
                <Field label="Period">
                  <input
                    value={exp.period}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        experiences: listMap(p.experiences, i, {
                          period: e.target.value,
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <Field label="Bullet points (one per line)">
                  <textarea
                    rows={3}
                    value={exp.bullets.join("\n")}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        experiences: listMap(p.experiences, i, {
                          bullets: e.target.value.split("\n"),
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddBtn
              onClick={() =>
                set("experiences", [
                  {
                    title: "",
                    company: "",
                    dept: "",
                    type: "",
                    period: "",
                    bullets: [""],
                  },
                  ...draft.experiences,
                ])
              }
            >
              Add experience
            </AddBtn>
          </div>
        </Panel>

        {/* ── Awards ── */}
        <Panel title="Awards & Achievements">
          <div className="space-y-3">
            {draft.awards.map((award, i) => (
              <ItemCard
                key={i}
                onRemove={() =>
                  set("awards", draft.awards.filter((_, idx) => idx !== i))
                }
              >
                <Field label="Title">
                  <input
                    value={award.title}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        awards: listMap(p.awards, i, {
                          title: e.target.value,
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    rows={2}
                    value={award.desc}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        awards: listMap(p.awards, i, {
                          desc: e.target.value,
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddBtn
              onClick={() =>
                set("awards", [{ title: "", desc: "" }, ...draft.awards])
              }
            >
              Add award
            </AddBtn>
          </div>
        </Panel>

        {/* ── Education ── */}
        <Panel title="Education">
          <div className="space-y-3">
            {draft.education.map((edu, i) => (
              <ItemCard
                key={i}
                onRemove={() =>
                  set(
                    "education",
                    draft.education.filter((_, idx) => idx !== i),
                  )
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Degree / exam">
                    <input
                      value={edu.degree}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          education: listMap(p.education, i, {
                            degree: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Institution">
                    <input
                      value={edu.institution}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          education: listMap(p.education, i, {
                            institution: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Detail">
                    <input
                      value={edu.detail}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          education: listMap(p.education, i, {
                            detail: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Grade">
                    <input
                      value={edu.grade}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          education: listMap(p.education, i, {
                            grade: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-xs text-cream/50">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        education: listMap(p.education, i, {
                          current: e.target.checked,
                        }),
                      }))
                    }
                    className="accent-[#8DB355]"
                  />
                  Currently studying here
                </label>
              </ItemCard>
            ))}
            <AddBtn
              onClick={() =>
                set("education", [
                  {
                    degree: "",
                    institution: "",
                    detail: "",
                    grade: "",
                    current: false,
                  },
                  ...draft.education,
                ])
              }
            >
              Add education
            </AddBtn>
          </div>
        </Panel>

        {/* ── Hobbies ── */}
        <Panel title="Hobbies & Interests">
          <ChipsEditor
            label="Hobby tags"
            items={draft.hobbies}
            onChange={(hobbies) => set("hobbies", hobbies)}
            addToTop
          />
        </Panel>

        {/* ── References ── */}
        <Panel title="References">
          <div className="space-y-3">
            {draft.references.map((ref, i) => (
              <ItemCard
                key={i}
                onRemove={() =>
                  set(
                    "references",
                    draft.references.filter((_, idx) => idx !== i),
                  )
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      value={ref.name}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          references: listMap(p.references, i, {
                            name: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Role">
                    <input
                      value={ref.role}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          references: listMap(p.references, i, {
                            role: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      value={ref.company}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          references: listMap(p.references, i, {
                            company: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      value={ref.email}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          references: listMap(p.references, i, {
                            email: e.target.value,
                          }),
                        }))
                      }
                      className={fieldClass}
                    />
                  </Field>
                </div>
                <Field label="Phones (one per line)">
                  <textarea
                    rows={2}
                    value={ref.phones.join("\n")}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        references: listMap(p.references, i, {
                          phones: e.target.value.split("\n"),
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddBtn
              onClick={() =>
                set("references", [
                  { name: "", role: "", company: "", email: "", phones: [""] },
                  ...draft.references,
                ])
              }
            >
              Add reference
            </AddBtn>
          </div>
        </Panel>

        {/* ── Stats ── */}
        <Panel title="Stats & Highlights">
          <div className="space-y-3">
            {draft.stats.map((stat, i) => (
              <div
                key={i}
                className="grid items-end gap-3 rounded-lg border border-cream/10 bg-bg/40 p-3 sm:grid-cols-[1fr_1fr_1.5fr_auto]"
              >
                <Field label="Value">
                  <input
                    value={stat.value}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        stats: listMap(p.stats, i, { value: e.target.value }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <Field label="Label">
                  <input
                    value={stat.label}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        stats: listMap(p.stats, i, { label: e.target.value }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <Field label="Sub text">
                  <input
                    value={stat.sub}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        stats: listMap(p.stats, i, { sub: e.target.value }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <div className="pb-2">
                  <RemoveBtn
                    onClick={() =>
                      set(
                        "stats",
                        draft.stats.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <AddBtn
              onClick={() =>
                set("stats", [...draft.stats, { value: "", label: "", sub: "" }])
              }
            >
              Add stat
            </AddBtn>
          </div>
        </Panel>

        {/* ── Languages ── */}
        <Panel title="Languages">
          <div className="space-y-3">
            {draft.languages.map((lang, i) => (
              <div
                key={i}
                className="grid items-end gap-3 rounded-lg border border-cream/10 bg-bg/40 p-3 sm:grid-cols-2"
              >
                <Field label="Name">
                  <input
                    value={lang.name}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        languages: listMap(p.languages, i, {
                          name: e.target.value,
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <Field label="Level label">
                  <input
                    value={lang.level}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        languages: listMap(p.languages, i, {
                          level: e.target.value,
                        }),
                      }))
                    }
                    className={fieldClass}
                  />
                </Field>
                <Field label={`Percent — ${lang.pct}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={lang.pct}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        languages: listMap(p.languages, i, {
                          pct: Number(e.target.value),
                        }),
                      }))
                    }
                    className="w-full accent-[#8DB355]"
                  />
                </Field>
                <div className="flex items-center gap-3">
                  <Field label="Color">
                    <input
                      type="color"
                      value={lang.color}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          languages: listMap(p.languages, i, {
                            color: e.target.value,
                          }),
                        }))
                      }
                      className="h-10 w-12 cursor-pointer rounded border border-cream/10 bg-bg/60"
                    />
                  </Field>
                  <div className="pb-2">
                    <RemoveBtn
                      onClick={() =>
                        set(
                          "languages",
                          draft.languages.filter((_, idx) => idx !== i),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <AddBtn
              onClick={() =>
                set("languages", [
                  ...draft.languages,
                  { name: "", pct: 50, level: "", color: "#8DB355" },
                ])
              }
            >
              Add language
            </AddBtn>
          </div>
        </Panel>

        {/* ── Sections layout (drag & drop) ── */}
        <Panel
          title="Sections Layout"
          hint="Drag to reorder — click the eye to show / hide a section on /profile"
        >
          <Reorder.Group
            axis="y"
            values={draft.sectionOrder}
            onReorder={(order) => set("sectionOrder", order)}
            className="space-y-2"
          >
            {draft.sectionOrder.map((key) => {
              const visible = draft.sectionVisibility[key] !== false;
              const meta = PROFILE_SECTIONS.find((s) => s.key === key);
              return (
                <Reorder.Item
                  key={key}
                  value={key}
                  className="flex items-center gap-3 rounded-lg border border-cream/10 bg-bg/60 px-4 py-3"
                >
                  <GripVertical
                    size={15}
                    className="shrink-0 cursor-grab text-cream/30"
                  />
                  <span className="flex-1 text-sm text-cream">
                    {SECTION_LABELS[key] ?? key}
                  </span>
                  <span className="rounded-full border border-cream/10 px-2 py-0.5 font-mono text-[10px] uppercase text-cream/35">
                    {meta?.column === "right" ? "sidebar" : "main"}
                  </span>
                  <button
                    type="button"
                    title={visible ? "Hide section" : "Show section"}
                    onClick={() => toggleSection(key)}
                    className={
                      visible
                        ? "text-[#8DB355] transition-colors hover:text-cream"
                        : "text-cream/25 transition-colors hover:text-cream/60"
                    }
                  >
                    {visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          <p className="text-xs text-cream/30">
            “main” sections render in the left column, “sidebar” sections in
            the right column of /profile.
          </p>
        </Panel>
      </form>
    </div>
  );
}
