const data = {
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false
}


export const verifyImg = (
  img1?: string | File,
  img2?: string | File
): string | undefined => {
  if (img1 instanceof File || img2 instanceof File) return
  const verifyLink = (link?: string): boolean => {
    return !!(typeof link === 'string' && link?.startsWith('http'))
  }
  if (verifyLink(img1) || verifyLink(img2)) {
    if (verifyLink(img1) && verifyLink(img2)) {
      return $q.screen.width > 500 ? img1 : img2
    }
    return verifyLink(img1) ? img1 : verifyLink(img2) ? img2 : undefined
  }
}