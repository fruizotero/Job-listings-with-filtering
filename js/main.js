const $filter = document.querySelector(".filter");
const $filterTags = document.querySelector(".filter__tags");
const $jobTags = document.querySelector(".job__tags");
const $jobs = document.querySelector(".jobs");

const $fragmentJobs = document.createDocumentFragment();
let $fragmentJobTags = document.createDocumentFragment();

const $templateJob = document.querySelector(".template-job").content;
const $templateJobTag = document.querySelector(".button-tag").content;
const $templateFilterTag = document.querySelector(".template-filter").content;

async function getData() {
    try {

        let res = await fetch("assets/data.json");
        let json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        json.forEach(element => {
            $templateJob.querySelector(".job__image").setAttribute('src', element.logo);
            $templateJob.querySelector(".job__company").textContent = element.company;
            if (!element.new)
                $templateJob.querySelector(".new").style.display = "none"
            if (!element.featured)
                $templateJob.querySelector(".featured").style.display = "none"
            if (!(element.new && element.featured))
                $templateJob.querySelector(".job").classList.remove("border__new__featured");
            $templateJob.querySelector(".job__position").textContent = element.position;
            $templateJob.querySelector(".job__date").textContent = element.postedAt;
            $templateJob.querySelector(".job__contract").textContent = element.contract;
            $templateJob.querySelector(".job__location").textContent = element.location;
            //Tags
            let tempTags = [...element.languages, ...element.tools];
            tempTags.unshift(element.level);
            tempTags.unshift(element.role);

            tempTags.forEach(el => {
                //Se añaden los tags como clases que servirán para filtrar
                $templateJob.querySelector(".job__tags").classList.add(el);
                $templateJobTag.querySelector(".job__tag").textContent = el;
                let $clone = document.importNode($templateJobTag, true);
                $fragmentJobTags.appendChild($clone);
            });

            //Se reemplazan los children del componente sino se acumularán
            $templateJob.querySelector(".job__tags").replaceChildren($fragmentJobTags)

            let $clone = document.importNode($templateJob, true);
            $fragmentJobs.appendChild($clone);
            //Una vez clonado el template, se eliminan las clases añadidas para que no se acumulen
            tempTags.forEach(el => {
                $templateJob.querySelector(".job__tags").classList.remove(el);
            })

        });


        $jobs.appendChild($fragmentJobs);

    } catch (error) {
        console.log(error);
    }

}


document.addEventListener("DOMContentLoaded", e => {
    getData();
});

let tags = [];
let containTag = false;
const addRemoveTags = () => {
    const $jobTags = document.querySelectorAll(".job__tags");
    $jobTags.forEach(el => {
        for (let index = 0; index < tags.length; index++) {
            containTag = el.classList.contains(tags[index]);
            //Si hay algún false directamente salimos del bucle con el break
            if (!containTag)
                break;
        }
        if (containTag) {
            el.closest(".job").classList.remove("job--hidden");
        } else {
            el.closest(".job").classList.add("job--hidden");
        }
    });
}
document.addEventListener("click", e => {

    if (e.target.matches(".job__tag")) {

        let tag = e.target.textContent;
        if (!tags.includes(tag)) {
            tags.push(tag);
            $filter.style.opacity = "1";
            //el id servirá para contener el valor del tag
            $templateFilterTag.querySelector(".filter__image__remove").dataset.id = tag;
            $templateFilterTag.querySelector(".filter__tag__name").textContent = tag;
            let $clone = document.importNode($templateFilterTag, true);
            $filterTags.appendChild($clone);
            addRemoveTags();
        }
        window.scrollTo({ behavior: "smooth", top: 0, });
    }

    if (e.target.matches(".filter__image__remove") || e.target.matches(".filter__remove")) {
        //Filtramos el array con todos los elementos menos el elemento eliminado, nos ayudamos del id

        let id = e.target.dataset.id || e.target.querySelector(".filter__image__remove").dataset.id;
        tags = tags.filter(el => el !== id);
        //Se elimina el elemento
        $filterTags.removeChild(e.target.closest(".filter__tag"));
        if (tags.length === 0) {
            $filter.style.opacity = "0";
            containTag = true
            addRemoveTags();
        }
        addRemoveTags();
    }

    if (e.target.matches(".filter__clear")) {
        tags = [];
        const $filterTagAll = document.querySelectorAll(".filter__tag");
        $filterTagAll.forEach(el => {
            $filterTags.removeChild(el);
        })
        $filter.style.opacity = "0";
        containTag = true;
        addRemoveTags();
    }
})