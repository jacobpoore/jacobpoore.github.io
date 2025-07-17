"use client"

import React from "react"

import { useState, useMemo } from "react"
import {
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon as ChevronDownExpandIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline"

export default function ProjectTable({ projectData, projectBaseUrl = "/projects/" }) {
  const [sortField, setSortField] = useState("title")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState(new Set())

  // Get unique categories and statuses
  const categories = useMemo(() => {
    const cats = [...new Set(projectData.map((p) => p.category))]
    return cats.sort()
  }, [projectData])

  const statuses = useMemo(() => {
    const stats = [...new Set(projectData.map((p) => p.status))]
    return stats.sort()
  }, [projectData])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = projectData

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((project) => project.category === filterCategory)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => project.status === filterStatus)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.technologies?.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
          project.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      // Handle date sorting
      if (sortField === "createdDate" || sortField === "updatedDate") {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }, [projectData, sortField, sortDirection, filterCategory, filterStatus, searchTerm])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleRowExpansion = (slug) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug)
    } else {
      newExpanded.add(slug)
    }
    setExpandedRows(newExpanded)
  }

  const handleKeyPress = (event, action, ...args) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      action(...args)
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
  }

  const getCategoryColor = (category) => {
    const colors = {
      code: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cad: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <PlayCircleIcon className="w-4 h-4 text-blue-500" />
      case "on-hold":
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, technologies, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search projects"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <FunnelIcon className="w-4 h-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            aria-label="Filter by category"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            aria-label="Filter by status"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="all">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Sort Controls */}
      <div className="block lg:hidden">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="status">Status</option>
            <option value="updatedDate">Last Updated</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            {sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAndSortedData.length} of {projectData.length} projects
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-8">
                  <span className="sr-only">Expand</span>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("title")}
                  onKeyDown={(e) => handleKeyPress(e, handleSort, "title")}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by project title"
                >
                  <div className="flex items-center gap-1">
                    Project Title
                    {getSortIcon("title")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("category")}
                  onKeyDown={(e) => handleKeyPress(e, handleSort, "category")}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by category"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {getSortIcon("category")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("status")}
                  onKeyDown={(e) => handleKeyPress(e, handleSort, "status")}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by status"
                >
                  <div className="flex items-center gap-1">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort("updatedDate")}
                  onKeyDown={(e) => handleKeyPress(e, handleSort, "updatedDate")}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by last updated"
                >
                  <div className="flex items-center gap-1">
                    Last Updated
                    {getSortIcon("updatedDate")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((project, index) => (
                  <React.Fragment key={project.slug}>
                    {/* Main Row */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {/* Expand Button */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpansion(project.slug)}
                          onKeyDown={(e) => handleKeyPress(e, toggleRowExpansion, project.slug)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`${expandedRows.has(project.slug) ? "Collapse" : "Expand"} details for ${project.title}`}
                          aria-expanded={expandedRows.has(project.slug)}
                        >
                          {expandedRows.has(project.slug) ? (
                            <ChevronDownExpandIcon className="w-4 h-4" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Project Title (Clickable Link) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`${projectBaseUrl}${project.slug}`}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                          aria-label={`View details for ${project.title}`}
                        >
                          {project.title}
                        </a>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(project.category)}`}
                        >
                          {project.category.toUpperCase()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                            {project.status.replace("-", " ")}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs lg:max-w-md">
                          {project.description}
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(project.updatedDate)}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedRows.has(project.slug) && (
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <td colSpan="6" className="px-6 py-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                              {/* Detailed Description */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                  Detailed Description
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {project.detailedDescription}
                                </p>
                              </div>

                              {/* Technologies */}
                              {project.technologies && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, techIndex) => (
                                      <span
                                        key={`${project.slug}-tech-${techIndex}`}
                                        className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Features */}
                              {project.features && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Key Features
                                  </h4>
                                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    {project.features.map((feature, featureIndex) => (
                                      <li
                                        key={`${project.slug}-feature-${featureIndex}`}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="text-green-500 mt-1">•</span>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                              {/* Project Metadata */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Project Info
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                      <span className="text-gray-900 dark:text-gray-100">
                                        {formatDate(project.createdDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <ClockIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                      <span className="text-gray-900 dark:text-gray-100">{project.duration}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Tags */}
                                {project.tags && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1">
                                      <TagIcon className="w-4 h-4" />
                                      Tags
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {project.tags.map((tag, tagIndex) => (
                                        <span
                                          key={`${project.slug}-tag-${tagIndex}`}
                                          className="inline-flex px-2 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Links */}
                              {project.links && Object.keys(project.links).length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1">
                                    <LinkIcon className="w-4 h-4" />
                                    Links
                                  </h4>
                                  <div className="space-y-2">
                                    {Object.entries(project.links).map(([type, url], linkIndex) => (
                                      <a
                                        key={`${project.slug}-link-${linkIndex}`}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                                      >
                                        <span className="capitalize">{type.replace("-", " ")}</span>
                                        <LinkIcon className="w-3 h-3" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredAndSortedData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            No projects found matching your criteria.
          </div>
        ) : (
          filteredAndSortedData.map((project) => (
            <div
              key={project.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`${projectBaseUrl}${project.slug}`}
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded block"
                      aria-label={`View details for ${project.title}`}
                    >
                      {project.title}
                    </a>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(project.category)}`}
                      >
                        {project.category.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {project.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRowExpansion(project.slug)}
                    onKeyDown={(e) => handleKeyPress(e, toggleRowExpansion, project.slug)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                    aria-label={`${expandedRows.has(project.slug) ? "Collapse" : "Expand"} details for ${project.title}`}
                    aria-expanded={expandedRows.has(project.slug)}
                  >
                    {expandedRows.has(project.slug) ? (
                      <ChevronDownExpandIcon className="w-5 h-5" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{project.description}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Updated {formatDate(project.updatedDate)}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRows.has(project.slug) && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <div className="space-y-4">
                    {/* Detailed Description */}
                    {project.detailedDescription && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Detailed Description
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {project.detailedDescription}
                        </p>
                      </div>
                    )}

                    {/* Technologies */}
                    {project.technologies && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={`${project.slug}-tech-${techIndex}`}
                              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {project.features && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Features</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {project.features.map((feature, featureIndex) => (
                            <li key={`${project.slug}-feature-${featureIndex}`} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Project Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Project Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="text-gray-900 dark:text-gray-100">{formatDate(project.createdDate)}</span>
                          </div>
                          {project.duration && (
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                              <span className="text-gray-900 dark:text-gray-100">{project.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {project.tags && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1">
                            <TagIcon className="w-4 h-4" />
                            Tags
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={`${project.slug}-tag-${tagIndex}`}
                                className="inline-flex px-2 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    {project.links && Object.keys(project.links).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1">
                          <LinkIcon className="w-4 h-4" />
                          Links
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(project.links).map(([type, url], linkIndex) => (
                            <a
                              key={`${project.slug}-link-${linkIndex}`}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                            >
                              <span className="capitalize">{type.replace("-", " ")}</span>
                              <LinkIcon className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
